*** Settings ***
Library           OperatingSystem
Library           SeleniumLibrary
#Library           JSONLibrary
Library         ImapLibrary2
Library         OperatingSystem
Library         String
Library         Collections
#Library         CustomLibrary/VulnerabilityScanner.py
Library         PenTest.py
#Resource 	    SeleniumDrivers.robot

#Suite Setup 	Update Chrome Webdriver


*** Variables ***
${BROWSER}          Chrome
#${URL}    https://juice-shop.herokuapp.com/
#${URL}    https://www.bestbuy.com/
#${URL}     https://www.att.com/
${URL}    http://www.itsecgames.com/bugs.htm

*** Test Cases ***
Find Vulnerabilities
    ${vulnerabilities}=     Scan Website    ${URL}
    Log    ${vulnerabilities}
    Generate Html Report    ${vulnerabilities}