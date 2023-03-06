"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post, Bookmark, Follow_Map
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

#   *** hashing password during registration? need help with this ***
#   *** JWT auth during login.. how to ensure username/password matches ***

# Routes needed (YAN):
#   PUT, DELETE User
#   PUT, DELETE Post, GET all posts, GET post by ID of author
#   POST, GET, & DELETE Bookmark, GET all bookmarks with ID of user
#   GET, DELETE folow_map, GET all follow_maps by follower_id
#   GET user, posts by username?? Worried of how we will access user id from front end
#   The backref attribute (see models) allows access to the related post from a User object using the user.posts attribute, for example
        # maybe this can be used? not sure

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
        return jsonify(access_token), 200
    # if the user does exist but the provided password was incorrect
    else:
        return jsonify(f'Error: Incorrect password was given for user: {user.username}.'), 401


# @api.route('/private',methods=["GET"])
# @jwt_required()
# def private():
#     user_token=get_jwt_identity()
#     user=User.query.get(user_token)
#     return jsonify(user.serialize()),200

# post (register) a new user
@api.route('/register', methods=['POST'])
def create_user():
    rb = request.get_json()
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
        # password=bcrypt.hashpw(rb["password"].encode('utf-8'), bcrypt.gensalt()), 
        is_active=True
        )
    db.session.add(new_user)
    db.session.commit()
    return f"User {rb['username']} was created", 200


# get a user
@api.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    # put in the primary key as argument to get
    user = User.query.get(id)
    if user is None:
        raise APIException("User not found", 404)
    return jsonify(user.serialize()), 200


# get all users
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    # return serialized version! this ensures password is not returned
    users_list = list(map(lambda user: user.serialize(), users))
    return jsonify(users_list), 200


# create a new post
@api.route('/post', methods=['POST'])
def create_post():
    rb = request.get_json()
    author = User.query.get(rb["author_id"])
    if author is None:
        raise APIException("User not found", 404)
    new_post = Post(
        author_id=rb["author_id"],
        author = author,
        field_of_study=rb["field_of_study"],
        post_type=rb["post_type"],
        title=rb["title"],
        content=rb["content"],
    )
    db.session.add(new_post)
    db.session.commit()
    return f"Post '{rb['title']}' was created", 200


# get a post
@api.route('/post/<int:id>', methods=['GET'])
def get_post(id):
    # put in the primary key as argument to get
    post = Post.query.get(id)
    if post is None:
        raise APIException("Post not found", 404)
    return jsonify(post.serialize()), 200


# post a follow_map
@api.route('/follow', methods=['POST'])
def create_follow_map():
    rb = request.get_json()
    user_follower = User.query.get(rb["follower_id"])
    user_target = User.query.get(rb["target_user_id"])
    if user_follower is None:
        raise APIException("User who is following is not found", 404)
    if user_target is None:
        raise APIException("User who is being followed is not found", 404)
    new_follow_map = Follow_Map(
        follower_id = rb["follower_id"],
        target_user_id = rb["target_user_id"]
    )
    db.session.add(new_follow_map)
    db.session.commit()
    return f"Follow map was created", 200