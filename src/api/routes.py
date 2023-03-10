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

api = Blueprint('api', __name__)

#   *** hashing password during registration? ***

# Routes needed:
#   PUT User
#   GET post by ID of author
#   POST, GET, & DELETE Bookmark, GET all bookmarks with ID of user
#   GET, DELETE folow_map, GET all follow_maps by follower_id

#   The backref attribute (see models) allows access to the related post from a User object using the user.posts attribute, for example
        # maybe this can be used? 

# get current user
# @api.route('/private',methods=["GET"])
# @jwt_required()
# def private():
#     user_token=get_jwt_identity()
#     user=User.query.get(user_token)
#     return jsonify(user.serialize()),200

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

# get user data
@api.route('/private',methods=["GET"])
@jwt_required()
# @cross_origin(origins=['https://3000-jessicabrin-capstoneful-tkbqih5kbhg.ws-us89.gitpod.io'], supports_credentials=True, methods=['GET', 'OPTIONS'])
def private():
    user_token=get_jwt_identity()
    user=User.query.get(user_token)
    return jsonify(user.serialize()),200

# register a new user
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
    return jsonify(new_user.serialize()),200

# delete a user
@api.route('/user/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return f"User {user.id} was deleted", 200


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
    return f"Post was created", 200

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
    return f"Post {post.id} was deleted", 200


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


# post a follow_map
@api.route('/follow', methods=['POST'])
@jwt_required()
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