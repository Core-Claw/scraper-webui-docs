---
title: HTTP/Socks5 网络代理
description: 为确保脚本在全球范围内稳定访问目标网站，平台会在运行时提供一条加密通道代理服务器。
sidebar:
  order: 1
---

## 代理环境说明

为确保脚本在全球范围内稳定访问目标网站，平台会在运行时提供一条加密通道（代理服务器）。

**脚本无需自行购买或维护代理**，只需读取平台注入的代理认证信息，并在 HTTP 请求中正确配置即可。

### 代理配置说明

- **协议**：`SOCKS5`
- **域名**：运行时从 `PROXY_DOMAIN` 环境变量读取
- **认证方式**：
    - 环境变量名：`PROXY_AUTH`
    - 格式：`username:password`
- **费用说明**：平台内置提供，无需额外付费或单独配置

### Python 示例

```python
import os
import requests

# 1. 从运行环境获取代理服务地址
proxyDomain = os.environ.get("PROXY_DOMAIN")

# 2. 获取代理认证信息（平台自动注入）
try:
    proxyAuth = os.environ.get("PROXY_AUTH")
    print(f"代理认证信息: {proxyAuth}")
except Exception as e:
    print(f"获取代理认证信息失败: {e}")
    proxyAuth = None

# 3. 拼接代理 URL
proxy_url = f"socks5://{proxyAuth}@{proxyDomain}" if proxyAuth else None
print(f"代理地址: {proxy_url}")

# 4. 示例请求
target_url = "https://ipinfo.io/ip"

try:
    proxies = None
    if proxy_url:
        proxies = {
            "http": proxy_url,
            "https": proxy_url
        }

    response = requests.get(
        target_url,
        proxies=proxies,
        timeout=30,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
    )

    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")

except Exception as e:
    print(f"请求失败: {e}")
```

### Go 示例

```go
// 1. 获取代理服务地址（仅从运行环境读取）
proxyDomain := os.Getenv("PROXY_DOMAIN")

// 2. 获取代理认证信息
proxyAuth := os.Getenv("PROXY_AUTH")
coresdk.Log.Info(ctx, fmt.Sprintf("代理认证信息: %s", proxyAuth))

// 3. 拼接代理 URL
var proxyURL string
if proxyAuth != "" {
    proxyURL = fmt.Sprintf("socks5://%s@%s", proxyAuth, proxyDomain)
}
coresdk.Log.Info(ctx, fmt.Sprintf("代理地址: %s", proxyURL))

// 4. 创建 HTTP Client
httpClient := &http.Client{
    Timeout: time.Second * 30,
}

// 5. 如果存在代理，配置 Transport
if proxyURL != "" {
    proxyParsed, err := url.Parse(proxyURL)
    if err != nil {
        coresdk.Log.Error(ctx, fmt.Sprintf("解析代理URL失败: %v", err))
        return
    }

    httpClient.Transport = &http.Transport{
        Proxy: http.ProxyURL(proxyParsed),
        TLSClientConfig: &tls.Config{
            InsecureSkipVerify: true,
        },
    }

    coresdk.Log.Info(ctx, "已配置代理客户端")
}

// 6. 示例业务请求
targetURL := "https://ipinfo.io/ip"
req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("创建请求失败: %v", err))
    return
}

resp, err := httpClient.Do(req)
if err != nil {
    coresdk.Log.Error(ctx, fmt.Sprintf("请求失败: %v", err))
    return
}
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
ip := strings.TrimSpace(string(body))

coresdk.Log.Info(ctx, fmt.Sprintf("响应状态码: %d", resp.StatusCode))
coresdk.Log.Info(ctx, fmt.Sprintf("当前出口 IP: %s", ip))
```

### Node.js 示例

**步骤 1：安装依赖**

```sh
npm install axios socks-proxy-agent
```

**步骤 2：示例代码**

```js
import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

// 1. 获取代理服务地址（仅从运行环境读取）
const proxyDomain = process.env.PROXY_DOMAIN

// 2. 获取代理认证信息
let proxyAuth = null
try {
    proxyAuth = process.env.PROXY_AUTH || null
    await coresdk.log.info(`代理认证信息: ${proxyAuth}`)
} catch (err) {
    await coresdk.log.error(`获取代理认证信息失败: ${err.message}`)
}

// 3. 拼接代理 URL
const proxyUrl = proxyAuth ? `socks5://${proxyAuth}@${proxyDomain}` : null

await coresdk.log.info(`代理地址: ${proxyUrl}`)

// 4. 创建 HTTP Client
let axiosConfig = {
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
}

// 5. 如果存在代理，配置 Agent
if (proxyUrl) {
    const agent = new SocksProxyAgent(proxyUrl)
    axiosConfig.httpAgent = agent
    axiosConfig.httpsAgent = agent
    axiosConfig.proxy = false
    await coresdk.log.info('已配置 SOCKS5 代理')
}

// 6. 示例业务请求
try {
    const targetUrl = 'https://ipinfo.io/ip'
    await coresdk.log.info(`开始请求: ${targetUrl}`)

    const response = await axios.get(targetUrl, axiosConfig)

    await coresdk.log.info(`响应状态码: ${response.status}`)
    await coresdk.log.info(`当前出口 IP: ${response.data.trim()}`)
} catch (err) {
    await coresdk.log.error(`请求失败: ${err.message}`)
}
```

:::note[注意事项]

- 不要硬编码代理账号或密码
- 始终优先使用平台注入的 `PROXY_AUTH`
- Node.js 中必须设置 `proxy = false`，否则 SOCKS 代理不会生效

:::

## 执行节点

下表列出了所有可用的执行节点代码及其对应的国家或地区名称。

| 代码 | 国家/地区名称 | 代码 | 国家/地区名称 | 代码 | 国家/地区名称 |
| ---- | ------------- | ---- | ------------- | ---- | ------------- |
| AD   | 安道尔        | AE   | 阿联酋        | AF   | 阿富汗        |
| AG   | 安提瓜和巴布达| AI   | 安圭拉        | AL   | 阿尔巴尼亚    |
| AM   | 亚美尼亚      | AO   | 安哥拉        | AQ   | 南极洲        |
| AR   | 阿根廷        | AS   | 美属萨摩亚    | AT   | 奥地利        |
| AU   | 澳大利亚      | AW   | 阿鲁巴        | AX   | 奥兰群岛      |
| AZ   | 阿塞拜疆      | BA   | 波黑          | BB   | 巴巴多斯      |
| BD   | 孟加拉国      | BE   | 比利时        | BF   | 布基纳法索    |
| BG   | 保加利亚      | BH   | 巴林          | BI   | 布隆迪        |
| BJ   | 贝宁          | BL   | 圣巴泰勒米    | BM   | 百慕大        |
| BN   | 文莱          | BO   | 玻利维亚      | BQ   | 荷属加勒比    |
| BR   | 巴西          | BS   | 巴哈马        | BT   | 不丹          |
| BW   | 博茨瓦纳      | BY   | 白俄罗斯      | BZ   | 伯利兹        |
| CA   | 加拿大        | CC   | 科科斯群岛    | CD   | 刚果(金)      |
| CF   | 中非          | CG   | 刚果(布)      | CH   | 瑞士          |
| CI   | 科特迪瓦      | CK   | 库克群岛      | CL   | 智利          |
| CM   | 喀麦隆        | CN   | 中国          | CO   | 哥伦比亚      |
| CR   | 哥斯达黎加    | CU   | 古巴          | CV   | 佛得角        |
| CW   | 库拉索        | CX   | 圣诞岛        | CY   | 塞浦路斯      |
| CZ   | 捷克          | DE   | 德国          | DJ   | 吉布提        |
| DK   | 丹麦          | DM   | 多米尼克      | DO   | 多米尼加      |
| DZ   | 阿尔及利亚    | EC   | 厄瓜多尔      | EE   | 爱沙尼亚      |
| EG   | 埃及          | EH   | 西撒哈拉      | ER   | 厄立特里亚    |
| ES   | 西班牙        | ET   | 埃塞俄比亚    | FI   | 芬兰          |
| FJ   | 斐济          | FK   | 福克兰群岛    | FM   | 密克罗尼西亚  |
| FO   | 法罗群岛      | FR   | 法国          | GA   | 加蓬          |
| GB   | 英国          | GD   | 格林纳达      | GE   | 格鲁吉亚      |
| GF   | 法属圭亚那    | GG   | 根西岛        | GH   | 加纳          |
| GI   | 直布罗陀      | GL   | 格陵兰        | GM   | 冈比亚        |
| GN   | 几内亚        | GP   | 瓜德罗普      | GQ   | 赤道几内亚    |
| GR   | 希腊          | GS   | 南乔治亚      | GT   | 危地马拉      |
| GU   | 关岛          | GW   | 几内亚比绍    | GY   | 圭亚那        |
| HK   | 香港          | HM   | 赫德岛        | HN   | 洪都拉斯      |
| HR   | 克罗地亚      | HT   | 海地          | HU   | 匈牙利        |
| ID   | 印度尼西亚    | IE   | 爱尔兰        | IL   | 以色列        |
| IM   | 马恩岛        | IN   | 印度          | IO   | 英属印度洋    |
| IQ   | 伊拉克        | IR   | 伊朗          | IS   | 冰岛          |
| IT   | 意大利        | JE   | 泽西岛        | JM   | 牙买加        |
| JO   | 约旦          | JP   | 日本          | KE   | 肯尼亚        |
| KG   | 吉尔吉斯斯坦  | KH   | 柬埔寨        | KI   | 基里巴斯      |
| KM   | 科摩罗        | KN   | 圣基茨        | KP   | 朝鲜          |
| KR   | 韩国          | KW   | 科威特        | KY   | 开曼群岛      |
| KZ   | 哈萨克斯坦    | LA   | 老挝          | LB   | 黎巴嫩        |
| LC   | 圣卢西亚      | LI   | 列支敦士登    | LK   | 斯里兰卡      |
| LR   | 利比里亚      | LS   | 莱索托        | LT   | 立陶宛        |
| LU   | 卢森堡        | LV   | 拉脱维亚      | LY   | 利比亚        |
| MA   | 摩洛哥        | MC   | 摩纳哥        | MD   | 摩尔多瓦      |
| ME   | 黑山          | MF   | 圣马丁        | MG   | 马达加斯加    |
| MH   | 马绍尔群岛    | MK   | 北马其顿      | ML   | 马里          |
| MM   | 缅甸          | MN   | 蒙古          | MO   | 澳门          |
| MP   | 北马里亚纳    | MQ   | 马提尼克      | MR   | 毛里塔尼亚    |
| MS   | 蒙特塞拉特    | MT   | 马耳他        | MU   | 毛里求斯      |
| MV   | 马尔代夫      | MW   | 马拉维        | MX   | 墨西哥        |
| MY   | 马来西亚      | MZ   | 莫桑比克      | NA   | 纳米比亚      |
| NC   | 新喀里多尼亚  | NE   | 尼日尔        | NF   | 诺福克岛      |
| NG   | 尼日利亚      | NI   | 尼加拉瓜      | NL   | 荷兰          |
| NO   | 挪威          | NP   | 尼泊尔        | NR   | 瑙鲁          |
| NU   | 纽埃          | NZ   | 新西兰        | OM   | 阿曼          |
| PA   | 巴拿马        | PE   | 秘鲁          | PF   | 法属波利尼西亚|
| PG   | 巴布亚新几内亚| PH   | 菲律宾        | PK   | 巴基斯坦      |
| PL   | 波兰          | PM   | 圣皮埃尔      | PN   | 皮特凯恩      |
| PR   | 波多黎各      | PS   | 巴勒斯坦      | PT   | 葡萄牙        |
| PW   | 帕劳          | PY   | 巴拉圭        | QA   | 卡塔尔        |
| RE   | 留尼汪        | RO   | 罗马尼亚      | RS   | 塞尔维亚      |
| RU   | 俄罗斯        | RW   | 卢旺达        | SA   | 沙特阿拉伯    |
| SB   | 所罗门群岛    | SC   | 塞舌尔        | SD   | 苏丹          |
| SE   | 瑞典          | SG   | 新加坡        | SH   | 圣赫勒拿      |
| SI   | 斯洛文尼亚    | SJ   | 斯瓦尔巴      | SK   | 斯洛伐克      |
| SL   | 塞拉利昂      | SM   | 圣马力诺      | SN   | 塞内加尔      |
| SO   | 索马里        | SR   | 苏里南        | SS   | 南苏丹        |
| ST   | 圣多美        | SV   | 萨尔瓦多      | SX   | 荷属圣马丁    |
| SY   | 叙利亚        | SZ   | 斯威士兰      | TC   | 特克斯和凯科斯|
| TD   | 乍得          | TF   | 法属南部      | TG   | 多哥          |
| TH   | 泰国          | TJ   | 塔吉克斯坦    | TK   | 托克劳        |
| TL   | 东帝汶        | TM   | 土库曼斯坦    | TN   | 突尼斯        |
| TO   | 汤加          | TR   | 土耳其        | TT   | 特立尼达      |
| TV   | 图瓦卢        | TW   | 台湾          | TZ   | 坦桑尼亚      |
| UA   | 乌克兰        | UG   | 乌干达        | UM   | 美国边远岛    |
| US   | 美国          | UY   | 乌拉圭        | UZ   | 乌兹别克斯坦  |
| VA   | 梵蒂冈        | VC   | 圣文森特      | VE   | 委内瑞拉      |
| VG   | 英属维尔京    | VI   | 美属维尔京    | VN   | 越南          |
| VU   | 瓦努阿图      | WF   | 瓦利斯和富图纳| WS   | 萨摩亚        |
| XK   | 科索沃        | YE   | 也门          | YT   | 马约特        |
| ZA   | 南非          | ZM   | 赞比亚        | ZW   | 津巴布韦      |
