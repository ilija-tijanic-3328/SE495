import os

from twilio.rest import Client

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')
client = Client(account_sid, auth_token)


def send_code(phone_number, code):
    client.messages.create(to=phone_number, from_=twilio_number, body=f"Your verification code is: {code}")
