from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey

db = SQLAlchemy()

# flag for seeing if fieldOfStudy data was added to database
class Flag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fieldsOfStudyAdded = db.Column(db.Boolean, default=False)

class FieldOfStudy(db.Model):
    __tablename__="field_of_study"
    id = db.Column(db.Integer, primary_key=True)
    field = db.Column(db.String(120), unique=True, nullable=False)
    category = db.Column(db.String(120), unique=False, nullable=False)

    def __repr__(self):
        return '<FieldOfStudy %r>' % self.field

    def serialize(self):
        return {
            "id": self.id,
            "field": self.field,
            "category": self.category,
        }

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(120), unique=False, nullable=False)
    lastname = db.Column(db.String(120), unique=False, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    field_of_study = db.Column(db.String(80), unique=False, nullable=False)
    user_type = db.Column(db.String(80), unique=False, nullable=False)
    university = db.Column(db.String(80), unique=False, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

    def serialize(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "username": self.username,
            "email": self.email,
            "field_of_study": self.field_of_study,
            "user_type": self.user_type,
            "university": self.university,
            "is_active": self.is_active
        }

class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    # The backref attribute allows access to the related post from a User object using the user.posts attribute
    author = db.relationship('User', foreign_keys=[author_id], backref=db.backref('posts', lazy=True))
    field_of_study = db.Column(db.String(100), unique=False, nullable=False)
    post_type = db.Column(db.String(50), unique=False, nullable=False)
    title = db.Column(db.String(50), unique=False, nullable=False)
    content = db.Column(db.String(350), unique=False, nullable=False)

    def __repr__(self):
        return '<Post %r>' % self.title

    def serialize(self):
        return {
            "id": self.id,
            "author_id": self.author_id,
            "field_of_study": self.field_of_study,
            "post_type": self.post_type,
            "title": self.title,
            "content": self.content,
        }

class Bookmark(db.Model):
    __tablename__= 'bookmark'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('bookmarks', lazy=True))
    post_id = db.Column(db.Integer, ForeignKey('post.id'), nullable=False)
    user = db.relationship('Post', foreign_keys=[post_id])

    def __repr__(self):
        return '<Bookmark %r>' % self.post_id
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }

class Follow_Map(db.Model):
    __tablename__= 'follow_map'
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    user_follower = db.relationship('User', foreign_keys=[follower_id], backref=db.backref('follower', lazy=True))
    target_user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    user_target = db.relationship('User', foreign_keys=[target_user_id], backref=db.backref('following', lazy=True))

    def __repr__(self):
        return '<Follow_Map %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "target_user_id": self.target_user_id,
            "follower_id": self.follower_id,
        }

# Leaving comments out for now
# class Comment(db.Model):
#     __tablename__= 'comment'
#     id = db.Column(db.Integer, primary_key=True)
#     author_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
#     author = db.relationship('User', backref=db.backref('bookmarks', lazy=True))
#     post_id = db.Column(db.Integer, ForeignKey('post.id'), nullable=False)
#     content = db.Column(db.String(350), unique=False, nullable=False)

#     def __repr__(self):
#         return '<Comment %r>' % self.content
    
#     def serialize(self):
#         return {
#             "id": self.id,
#             "author_id": self.author_id,
#             "post_id": self.post_id,
#             "content": self.content
#         }