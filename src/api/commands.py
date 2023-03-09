
import click
from api.models import db, User, Flag, FieldOfStudy
import os
import csv

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but still in integration 
with your database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_data(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")
        
    # YOU ALREADY RAN THIS, DONT DO IT AGAIN
    @app.cli.command("initial-add-fields-data") 
    def add_fieldsOfStudy():
        csv_path = '/workspace/capstone-fullstack/src/api/majors-list.csv'
        with open(csv_path, 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row
            for row in reader:
                new_fieldOfStudy = FieldOfStudy(field=row[1], category=row[2])
                db.session.add(new_fieldOfStudy)
        db.session.commit()

    # @app.cli.command("add-fields-data") 
    # def add_data():
    #     a_flag = Flag.query.get(1)
    #     if a_flag:
    #         if a_flag.fieldsOfStudyAdded == False:
    #             # run the function to add the data
    #             add_fieldsOfStudy()
    #             # update the flag to indicate that the data has been added
    #             flag = Flag.query.get(1)
    #             flag.fieldsOfStudyAdded = True
    #             db.session.commit()
    #     else:
    #         new_flag = Flag()
            # return jsonify('Fields of study data has sucessfully been added to the database.'), 200
        # else:
        #     return jsonify('Fields of study data has already been added.'), 401
