
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
import pytest
import time
import os

@pytest.fixture
def driver():
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Firefox(options=options)
    yield driver
    driver.quit()

@pytest.fixture
def file_path():
    base_path = os.getcwd()
    html_file = os.path.abspath(os.path.join(base_path, '..', '2D Simulation', 'game.html'))
    return 'file://' + html_file

    

class TestBasic:
    def test_url(self, driver, file_path):
        driver.get(file_path)
        time.sleep(5)
        alert = driver.switch_to.alert
        alert.accept()
        print(driver.title)
        assert True == True



