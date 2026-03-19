---
title: Selenium
description: 在现代 Web 数据采集场景下，为什么选择 Selenium 作为页面采集框架，以及官方推荐的使用方式。
---

> 在现代 Web 数据采集场景下，为什么选择 Selenium 作为页面采集框架，以及官方推荐的使用方式。

## 一、Selenium 的定位与作用

**Selenium 是一个基于 WebDriver 协议的浏览器自动化框架**，

通过 Remote WebDriver 方式，可实现对远程真实浏览器的控制。

其主要能力包括：

- 真实 Chromium 浏览器控制
- 页面加载与 JavaScript 执行
- DOM 查询与基础事件模拟
- 支持对接远程指纹浏览器集群

> Selenium 并非模拟浏览器请求，
>
> 而是通过 WebDriver 协议 **驱动真实浏览器执行网页逻辑**。

---

## 二、官方推荐写法

##### 1️⃣ 连接远程指纹浏览器

平台已提供 **基于 HTTP WebDriver 协议的指纹浏览器服务**，

通过 Remote 方式接入。

```python
try:
    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f"当前获取的浏览器认证信息: {Auth}")
except Exception as e:
    # 捕获其他未知异常
    CafeSDK.Log.error(f"当前获取浏览器认证信息失败: {e}")
    Auth = None
    return

browser_url = f'http://{Auth}@chrome-http-inner.cafescraper.com' #指纹浏览器的webdriver连接地址
rest_item = {"url": url, "html": "", "resp_status": "200"}

# 设置 Chrome 选项
chrome_options = webdriver.ChromeOptions()

# 添加一些常用选项
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1920,1080')

CafeSDK.Log.info(f"请求的url：{url}")
try:
    driver = webdriver.Remote(
        command_executor=browser_url,
        options=chrome_options
    )
except Exception as e:
    CafeSDK.Log.info(f"[错误] 指纹浏览器连接失败: {e}")
    rest_item['resp_status'] = "403"
    return
```

---

###### 2️⃣ 页面访问与内容获取

```python
try:
    driver.get(url)
    WebDriverWait(driver,3 *60).until(lambda d: d.execute_script("return document.readyState") == "complete")
    html = driver.page_source
    rest_item["html"] = html
except Exceptionas e:
    CafeSDK.Log.info(f"[错误] 获取浏览器html失败: {e}")
    rest_item['resp_status'] ="500"

CafeSDK.Result.push_data(rest_item)
```

---

## 三、完整平台脚本入口示例（推荐直接使用）

```python
import asyncio
import os

from seleniumimport webdriver
from selenium.webdriver.support.uiimport WebDriverWait

from sdkimport CafeSDK

asyncdefrun():
    CafeSDK.Log.info("🚀 Init...")
    CafeSDK.Log.info("====================================================")
    CafeSDK.Log.info("🚀 CafeScraper Selenium Browser Scrape Demo")
    CafeSDK.Log.info("====================================================")

    headers = [
        {"label":"url","key":"url","format":"text"},
        {"label":"html","key":"html","format":"text"},
        {"label":"resp_status","key":"resp_status","format":"text"},
    ]
    CafeSDK.Result.set_table_header(headers)

    input_json_dict = CafeSDK.Parameter.get_input_json_dict()
    url = input_json_dict['url']

    Auth = os.environ.get("PROXY_AUTH")
    CafeSDK.Log.info(f"当前获取的浏览器认证信息: {Auth}")

    browser_url =f'http://{Auth}@chrome-http-inner.cafescraper.com'
    rest_item = {"url": url,"html":"","resp_status":"200"}

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')

try:
    driver = webdriver.Remote(
        command_executor=browser_url,
        options=chrome_options
    )
except Exceptionas e:
    CafeSDK.Log.info(f"[错误] 指纹浏览器连接失败: {e}")
    rest_item['resp_status'] ="403"
return

try:
    driver.get(url)
    WebDriverWait(driver,3 *60).until(lambda d: d.execute_script("return document.readyState") =="complete")
    rest_item["html"] = driver.page_source
except Exceptionas e:
    CafeSDK.Log.info(f"[错误] 获取浏览器html失败: {e}")
    rest_item['resp_status'] ="500"

    CafeSDK.Result.push_data(rest_item)

if __name__ =="__main__":
    asyncio.run(run())
```

---

## 四、动态内容与 DOM 操作

##### 获取单个元素

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 方法1：CSS选择器（推荐）
element = driver.find_element(By.CSS_SELECTOR, '.product-title')
element = driver.find_element(By.ID, 'main-content')  # ID选择器
element = driver.find_element(By.TAG_NAME, 'h1')

# 方法2：XPath
element = driver.find_element(By.XPATH, '//div[@class="container"]')
element = driver.find_element(By.XPATH, '//button[contains(text(), "提交")]')

# 方法3：其他定位方式
element = driver.find_element(By.CLASS_NAME, 'product-item')
element = driver.find_element(By.NAME, 'username')
element = driver.find_element(By.LINK_TEXT, '立即购买')
element = driver.find_element(By.PARTIAL_LINK_TEXT, '购买')

# 等待元素出现（推荐）
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '.product-title'))
)

# 检查元素是否存在
try:
    element = driver.find_element(By.CSS_SELECTOR, '.product-title')
    text = element.text
    html = element.get_attribute('outerHTML')
    class_name = element.get_attribute('class')
    href = element.get_attribute('href')
    is_displayed = element.is_displayed()
except NoSuchElementException:
    print("元素不存在")
```

##### 批量元素处理

```python
# 获取所有匹配元素
product_items = driver.find_elements(By.CSS_SELECTOR, '.product-item')
print(f"找到 {len(product_items)} 个商品")

# 遍历处理
products_data = []
for item in product_items:
    try:
        name_elem = item.find_element(By.CSS_SELECTOR, '.name')
        name = name_elem.text
    except NoSuchElementException:
        name = ''

    try:
        price_elem = item.find_element(By.CSS_SELECTOR, '.price')
        price = price_elem.text
    except NoSuchElementException:
        price = ''

    try:
        link_elem = item.find_element(By.CSS_SELECTOR, '.link')
        link = link_elem.get_attribute('href')
    except NoSuchElementException:
        link = ''

    products_data.append({
        'name': name,
        'price': price,
        'link': link
    })

# 使用列表推导式（带异常处理）
names = []
for item in product_items:
    try:
        names.append(item.find_element(By.CSS_SELECTOR, '.name').text)
    except NoSuchElementException:
        continue

# 使用filter和map（更函数式）
def get_name(item):
    try:
        return item.find_element(By.CSS_SELECTOR, '.name').text
    except NoSuchElementException:
        return None

names = list(filter(None, map(get_name, product_items)))

# 使用JavaScript批量获取（性能更高）
products_data = driver.execute_script('''
    const items = document.querySelectorAll('.product-item');
    return Array.from(items).map(item => {
        const nameElem = item.querySelector('.name');
        const priceElem = item.querySelector('.price');
        const linkElem = item.querySelector('.link');
        return {
            name: nameElem ? nameElem.textContent.trim() : '',
            price: priceElem ? priceElem.textContent.trim() : '',
            link: linkElem ? linkElem.href : ''
        };
    });
''')
```

**特点说明：**

- 操作真实浏览器 DOM
- 可获取 JS 渲染后的内容
- 与前端展示逻辑一致

---

## 五、官方不推荐写法（反例）

##### ❌ 使用 sleep 等待页面加载

```python
time.sleep(5)
```

问题：

- 无法保证 JS 执行完成
- 页面慢时失败
- 页面快时浪费时间

##### ❌ 使用 requests 模拟浏览器页面

```python
requests.get(url)
```

问题：

- 页面内容不完整
- 容易触发反爬机制
- 成功率不可控
