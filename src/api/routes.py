"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post, Bookmark, Follow_Map, FieldOfStudy, Flag
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import os
import csv
from werkzeug.utils import secure_filename

api = Blueprint('api', __name__)
app = Flask(__name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
UPLOAD_FOLDER = '/workspace/capstone-fullstack/src/api/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/user/<int:user_id>/upload', methods=['POST'])
def upload_file(user_id):
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        user = User.query.get(user_id)
        with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'rb') as f:
            user.profile_picture = f.read()
        db.session.commit()
        return jsonify({'message': 'File uploaded successfully.'}), 200
    else:
        return jsonify({'error': 'Invalid file type.'}), 400

#   *** hashing password ***

#   The backref attribute (see models) allows access to the related post from a User object using the user.posts attribute, for example
        # maybe this can be used? 


# find a field of study.
# /find-field?query=<input>
@api.route("/find-field", methods=["GET"])
def find_fieldOfStudy():
    query = request.args.get('query', '')
    fields = FieldOfStudy.query.all()
    filtered_fields = list(field.serialize() for field in fields if query.lower() in field.field.lower())
    return jsonify(filtered_fields), 200


# get all FieldsOfStudy data
@api.route("/get-fields-data", methods=["GET"])
def get_fields_data():
    fields = FieldOfStudy.query.all()
    fields_list = list(map(lambda field: field.serialize(), fields))
    return jsonify(fields_list), 200

# Create a route to authenticate your users and return JWTs.
# This will happen at login
@api.route("/token", methods=["POST"])
def create_token():
    body = request.get_json(force=True)
    user = db.session.query(User).filter(User.username == body['username']).first()
    # if the username provided does not match a user in the database
    if user == None:
        return jsonify('Error: User does not exist.'), 401
    # if the provided username & password are correct, create the access token
    elif user.password == body['password'] and user.username == body['username']:
        access_token = create_access_token(identity={'id': user.id})
        return jsonify(access_token = access_token, user=user.serialize()), 200
    # if the user does exist but the provided password was incorrect
    else:
        return jsonify(f'Error: Incorrect password was given for user: {user.username}.'), 401


# register a new user
@api.route('/register', methods=['POST'])
def create_user():
    rb = request.get_json()
    # hashed_password = bcrypt.hashpw(rb["password"].encode('utf-8'), bcrypt.gensalt())
    new_user = User(
        firstname=rb["firstname"],
        lastname=rb["lastname"],
        username=rb["username"],
        email=rb["email"], 
        field_of_study=rb["field_of_study"],
        user_type=rb["user_type"],
        university=rb["university"],
        # need to hash the password
        password=rb["password"],
        is_active=True
        )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()),200

# delete a user
@api.route('/user/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'User {user.id} was deleted'}), 201


#get a user
@api.route('/user/<username>', methods=['GET'])
@jwt_required()
def get_user(username):
    user = db.session.query(User).filter(User.username == username).first()
    if user is None:
        raise APIException("User not found", 404)
    else:
        return jsonify(user.serialize()), 200


# get all users
@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    # return serialized version! this ensures password is not returned
    users_list = list(map(lambda user: user.serialize(), users))
    return jsonify(users_list), 200

# edit a user
@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        raise APIException("User not found", 404)
    request_body = request.get_json()
    if "firstname" in request_body:
        user.firstname = request_body["firstname"]
    if "lastname" in request_body:
        user.lastname = request_body["lastname"]
    if "username" in request_body:
        user.username = request_body["username"]
    if "email" in request_body:
        user.email = request_body["email"]
    if "field_of_study" in request_body:
        user.field_of_study = request_body["field_of_study"]
    if "user_type" in request_body:
        user.user_type = request_body["user_type"]
    if "university" in request_body:
        user.university = request_body["university"]
    # hash the password again
    if "password" in request_body:
        user.password = request_body["password"]

    db.session.commit()
    return jsonify(user.serialize()), 200



# create a new post
@api.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    rb = request.get_json()
    author = User.query.get(rb["author_id"])
    if author is None:
        raise APIException("User not found", 404)
    new_post = Post(
        author_id=rb["author_id"],
        field_of_study=rb["field_of_study"],
        post_type=rb["post_type"],
        title=rb["title"],
        content=rb["content"],
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify({'message': 'Post was created'}), 200


# update a post
@api.route('/post/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    post = Post.query.get(id)
    if post is None:
        raise APIException("Post not found", 404)
    rb = request.get_json()
    if "title" in rb:
        post.title = rb["title"]
    if "post_type" in rb:
        post.post_type = rb["post_type"]
    if "field_of_study" in rb:
        post.field_of_study = rb["field_of_study"]
    if "content" in rb:
        post.content = rb["content"]
    db.session.commit()
    return jsonify(post.serialize()), 200

# delete a post
@api.route('/post/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    post = Post.query.get(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': f'Post {post.id} was deleted'}), 200


# get a post
@api.route('/post/<int:id>', methods=['GET'])
@jwt_required()
def get_post(id):
    post = Post.query.get(id)
    if post is None:
        raise APIException("Post not found", 404)
    return jsonify(post.serialize()), 200


# get all posts
@api.route('/posts', methods=['GET'])
@jwt_required()
def get_all_posts():
    posts = Post.query.all()
    posts_list = list(map(lambda post: post.serialize(), posts))
    return jsonify(posts_list), 200

# get all posts by specific user
@api.route('/user/<int:user_id>/posts', methods=['GET'])
@jwt_required()
def get_user_posts(user_id):
    user = User.query.get(user_id)
    if user is None:
        raise APIException("User not found", 404)
    posts = Post.query.filter_by(author=user).all()
    posts_list = list(map(lambda post: post.serialize(), posts))
    return jsonify(posts_list), 200


# post a follow_map
@api.route('/follow', methods=['POST'])
@jwt_required()
def create_follow_map():
    rb = request.get_json()
    user_follower = User.query.get(rb["follower_id"])
    user_target = User.query.get(rb["target_user_id"])
    if user_follower is None:
        return jsonify({'message': 'User who is following is not found'}), 404

    if user_target is None:
        return jsonify({'message': 'User who is being followed is not found'}), 404
    new_follow_map = Follow_Map(
        follower_id = rb["follower_id"],
        target_user_id = rb["target_user_id"]
    )
    db.session.add(new_follow_map)
    db.session.commit()
    return jsonify({'message': 'Follow map was created'}), 200

# get a follow_map
@api.route('/follow-map/<int:follow_map_id>', methods=['GET'])
@jwt_required()
def get_follow_map(follow_map_id):
    follow_map = Follow_Map.query.get_or_404(follow_map_id)
    return jsonify(follow_map.serialize()), 200

# delete a follow_map
@api.route('/follow/<int:follow_map_id>', methods=['DELETE'])
@jwt_required()
def delete_follow_map(follow_map_id):
    follow_map = Follow_Map.query.get_or_404(follow_map_id)
    db.session.delete(follow_map)
    db.session.commit()
    return jsonify({'message': 'Follow map deleted successfully'}), 200

# get a follow_map by the follower_id
@api.route('/follow_map/<int:follower_id>', methods=['GET'])
@jwt_required()
def get_follow_map_by_follower_id(follower_id):
    follow_map = Follow_Map.query.filter_by(follower_id=follower_id).first()
    if follow_map is None:
        return jsonify({'error': 'No follow_map found for follower_id'}), 404
    return jsonify(follow_map.serialize()), 200

# get a follow_map by the target_user_id
@api.route('/follow_map/target/<int:target_user_id>', methods=['GET'])
@jwt_required()
def get_follow_map_by_target_id(target_user_id):
    follow_map = Follow_Map.query.filter_by(target_user_id=target_user_id).all()
    if not follow_map:
        return jsonify({"message": "No follow_map found for target_user_id: {}".format(target_user_id)}), 404
    return jsonify([fm.serialize() for fm in follow_map]), 200

# create bookmark
@api.route('/bookmark', methods=['POST'])
@jwt_required()
def create_bookmark():
    request_body = request.get_json()
    user_id = request_body.get('user_id')
    post_id = request_body.get('post_id')
    if not user_id or not post_id:
        return jsonify({'message': 'Missing required parameter(s)'}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    existing_bookmark = Bookmark.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing_bookmark:
        return jsonify({'message': 'Bookmark already exists'}), 409
    new_bookmark = Bookmark(
        user_id=user_id,
        post_id=post_id
    )
    db.session.add(new_bookmark)
    db.session.commit()
    return jsonify(new_bookmark.serialize()), 200


# get bookmarks by user id
@api.route('/bookmark/<int:user_id>', methods=['GET'])
@jwt_required()
def get_bookmark(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    bookmarks = Bookmark.query.filter_by(user_id=user_id).join(Post).all()
    bookmarks_list = [bookmark.post_r.serialize() for bookmark in bookmarks]
    return jsonify(bookmarks_list), 200

# get all bookmarks
@api.route('/all-bookmarks', methods=['GET'])
@jwt_required()
def get_all_bookmarks():
    bookmarks = Bookmark.query.all()
    bookmark_list = [bookmark.serialize() for bookmark in bookmarks]
    return jsonify(bookmark_list), 200

# delete a bookmark
@api.route('/delete-bookmark/<int:user_id>/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_bookmark(user_id, post_id):
    bookmark = Bookmark.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not bookmark:
        return jsonify({'message': 'Bookmark not found'}), 404
    db.session.delete(bookmark)
    db.session.commit()
    return jsonify({'message': 'Bookmark deleted successfully'}), 200