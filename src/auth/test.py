import requests
import re
import pandas as pd
import time
import random
import csv
import pymysql
import sys
import json

str = '\\"sgr\\":\\"100.00%\\",\\"ind\\":\\"手机\\",\\"mas\\":\\"4.88\\",\\"mg\\":\\"7.37%\\",\\"sas\\":\\"4.88\\",\\"sg\\":\\"13.31%\\",\\"cas\\":\\"4.90\\",\\"cg\\":\\"18.65%\\",\\"encryptedUserId\\":\\"UvFcYMmHyOmHGONTT\\"'
res = str.replace('\\', '')
print(res)
