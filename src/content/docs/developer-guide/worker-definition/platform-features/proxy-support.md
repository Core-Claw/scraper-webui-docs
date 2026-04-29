---
title: HTTP/Socks5 Network Proxy
description: To ensure stable access to target websites worldwide, the platform provides an encrypted network channel (proxy server) at runtime.
sidebar:
  order: 1
---

## Proxy Environment Overview

To ensure stable access to target websites worldwide, the platform provides an encrypted network channel (proxy server) at runtime.

**You do not need to purchase, deploy, or maintain proxies yourself.**

Simply read the proxy credentials injected by the platform and configure them correctly in your HTTP requests.

### Proxy Configuration

- **Protocol**: `SOCKS5`
- **Endpoint**: read from the `PROXY_DOMAIN` environment variable at runtime
- **Authentication**:
    - **Environment Variable**: `PROXY_AUTH`
    - **Format**: `username:password`
- **Cost**: **Built-in and free — no extra payment or manual setup required**

### Python Example

```python
import os
import requests

# 1. Get proxy service address from the runtime environment
proxyDomain = os.environ.get("PROXY_DOMAIN")

# 2. Get proxy credentials (automatically injected by the platform)
try:
    proxyAuth = os.environ.get("PROXY_AUTH")
    print(f"Proxy credentials: {proxyAuth}")
except Exception as e:
    print(f"Failed to get proxy credentials: {e}")
    proxyAuth = None

# 3. Build proxy URL
proxyUrl = f"socks5://{proxyAuth}@{proxyDomain}" if proxyAuth else None
print(f"Proxy URL: {proxyUrl}")

# 4. Create session with proxy
session = requests.Session()
if proxyUrl:
    session.proxies = {
        "http": proxyUrl,
        "https": proxyUrl
    }
    print("SOCKS5 proxy configured")

# 5. Example request
targetUrl = "https://ipinfo.io/ip"
response = session.get(targetUrl, timeout=30)
print(f"Status code: {response.status_code}")
print(f"Current exit IP: {response.text.strip()}")
```

### Go Example

```go
package main

import (
    "context"
    "crypto/tls"
    "fmt"
    "net/http"
    "net/url"
    "os"
    "time"
)

func main() {
    ctx := context.Background()

    // 1. Get proxy service address from the runtime environment
    proxyDomain := os.Getenv("PROXY_DOMAIN")

    // 2. Get proxy credentials
    proxyAuth := os.Getenv("PROXY_AUTH")
    fmt.Printf("Proxy credentials: %s\n", proxyAuth)

    // 3. Build proxy URL
    var proxyURL string
    if proxyAuth != "" {
        proxyURL = fmt.Sprintf("socks5://%s@%s", proxyAuth, proxyDomain)
    }
    fmt.Printf("Proxy URL: %s\n", proxyURL)

    // 4. Create HTTP client
    httpClient := &http.Client{
        Timeout: time.Second * 30,
    }

    // 5. Configure transport if proxy is enabled
    if proxyURL != "" {
        proxyParsed, err := url.Parse(proxyURL)
        if err != nil {
            fmt.Printf("Failed to parse proxy URL: %v\n", err)
            return
        }

        httpClient.Transport = &http.Transport{
            Proxy: http.ProxyURL(proxyParsed),
            TLSClientConfig: &tls.Config{
                InsecureSkipVerify: true,
            },
        }
        fmt.Println("SOCKS5 proxy configured")
    }

    // 6. Example request
    targetURL := "https://ipinfo.io/ip"
    req, err := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
    if err != nil {
        fmt.Printf("Failed to create request: %v\n", err)
        return
    }

    resp, err := httpClient.Do(req)
    if err != nil {
        fmt.Printf("Request failed: %v\n", err)
        return
    }
    defer resp.Body.Close()

    fmt.Printf("Status code: %d\n", resp.StatusCode)
}
```

### Node.js Example

```javascript
const axios = require('axios')
const { SocksProxyAgent } = require('socks-proxy-agent')

async function main() {
    // 1. Get proxy service address from the runtime environment
    const proxyDomain = process.env.PROXY_DOMAIN

    // 2. Get proxy credentials (automatically injected by the platform)
    const proxyAuth = process.env.PROXY_AUTH
    console.log(`Proxy credentials: ${proxyAuth}`)

    // 3. Build proxy URL
    const proxyUrl = proxyAuth ? `socks5://${proxyAuth}@${proxyDomain}` : null

    console.log(`Proxy URL: ${proxyUrl}`)

    // 4. Create HTTP Client
    let axiosConfig = {
        timeout: 30000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
    }

    // 5. Configure Agent if proxy exists
    if (proxyUrl) {
        const agent = new SocksProxyAgent(proxyUrl)
        axiosConfig.httpAgent = agent
        axiosConfig.httpsAgent = agent
        axiosConfig.proxy = false // Must disable axios default proxy
        console.log('SOCKS5 proxy configured')
    }

    // 6. Example request
    try {
        const targetUrl = 'https://ipinfo.io/ip'
        console.log(`Requesting: ${targetUrl}`)

        const response = await axios.get(targetUrl, axiosConfig)

        console.log(`Status code: ${response.status}`)
        console.log(`Current exit IP: ${response.data.trim()}`)
    } catch (err) {
        console.error(`Request failed: ${err.message}`)
    }
}

main()
```

:::note[Notes]

- Never hard-code proxy usernames or passwords
- Always use the platform-injected `PROXY_AUTH`
- In Node.js, `proxy = false` must be set, otherwise the SOCKS proxy will not work

:::

## Execution Nodes

The table below lists all available execution node codes and their corresponding country or region names.

| Code | Country / Region Name | Code | Country / Region Name | Code | Country / Region Name |
| ---- | --------------------- | ---- | --------------------- | ---- | --------------------- |
| AD   | Andorra               | AE   | United Arab Emirates  | AF   | Afghanistan           |
| AG   | Antigua & Barbuda     | AI   | Anguilla              | AL   | Albania               |
| AM   | Armenia               | AO   | Angola                | AQ   | Antarctica            |
| AR   | Argentina             | AS   | American Samoa        | AT   | Austria               |
| AU   | Australia             | AW   | Aruba                 | AX   | Åland Islands         |
| AZ   | Azerbaijan            | BA   | Bosnia & Herzegovina  | BB   | Barbados              |
| BD   | Bangladesh            | BE   | Belgium               | BF   | Burkina               |
| BG   | Bulgaria              | BH   | Bahrain               | BI   | Burundi               |
| BJ   | Benin                 | BL   | Saint Barthélemy      | BM   | Bermuda               |
| BN   | Brunei                | BO   | Bolivia               | BQ   | Caribbean Netherlands |
| BR   | Brazil                | BS   | The Bahamas           | BT   | Bhutan                |
| BW   | Botswana              | BY   | Belarus               | BZ   | Belize                |
| CA   | Canada                | CC   | Cocos Islands         | CD   | DR Congo              |
| CF   | Central African       | CG   | Republic of Congo     | CH   | Switzerland           |
| CI   | Côte d'Ivoire         | CK   | Cook Islands          | CL   | Chile                 |
| CM   | Cameroon              | CN   | China                 | CO   | Colombia              |
| CR   | Costa Rica            | CU   | Cuba                  | CV   | Cape Verde            |
| CW   | Curaçao               | CX   | Christmas Island      | CY   | Cyprus                |
| CZ   | Czech Republic        | DE   | Germany               | DJ   | Djibouti              |
| DK   | Denmark               | DM   | Dominica              | DO   | Dominican Republic    |
| DZ   | Algeria               | EC   | Ecuador               | EE   | Estonia               |
| EG   | Egypt                 | EH   | Western Sahara        | ER   | Eritrea               |
| ES   | Spain                 | ET   | Ethiopia              | FI   | Finland               |
| FJ   | Fiji                  | FK   | Falkland Islands      | FM   | Micronesia            |
| FO   | Faroe Islands         | FR   | France                | GA   | Gabon                 |
| GB   | United Kingdom        | GD   | Grenada               | GE   | Georgia               |
| GF   | French Guiana         | GG   | Guernsey              | GH   | Ghana                 |
| GI   | Gibraltar             | GL   | Greenland             | GM   | Gambia                |
| GN   | Guinea                | GP   | Guadeloupe            | GQ   | Equatorial Guinea     |
| GR   | Greece                | GS   | South Georgia         | GT   | Guatemala             |
| GU   | Guam                  | GW   | Guinea-Bissau         | GY   | Guyana                |
| HK   | Hong Kong             | HM   | Heard Island          | HN   | Honduras              |
| HR   | Croatia               | HT   | Haiti                 | HU   | Hungary               |
| ID   | Indonesia             | IE   | Ireland               | IL   | Israel                |
| IM   | Isle of Man           | IN   | India                 | IO   | British Indian Ocean  |
| IQ   | Iraq                  | IR   | Iran                  | IS   | Iceland               |
| IT   | Italy                 | JE   | Jersey                | JM   | Jamaica               |
| JO   | Jordan                | JP   | Japan                 | KE   | Kenya                 |
| KG   | Kyrgyzstan            | KH   | Cambodia              | KI   | Kiribati              |
| KM   | Comoros               | KN   | Saint Kitts & Nevis   | KP   | North Korea           |
| KR   | South Korea           | KW   | Kuwait                | KY   | Cayman Islands        |
| KZ   | Kazakhstan            | LA   | Laos                  | LB   | Lebanon               |
| LC   | Saint Lucia           | LI   | Liechtenstein         | LK   | Sri Lanka             |
| LR   | Liberia               | LS   | Lesotho               | LT   | Lithuania             |
| LU   | Luxembourg            | LV   | Latvia                | LY   | Libya                 |
| MA   | Morocco               | MC   | Monaco                | MD   | Moldova               |
| ME   | Montenegro            | MF   | Saint Martin          | MG   | Madagascar            |
| MH   | Marshall Islands      | MK   | North Macedonia       | ML   | Mali                  |
| MM   | Myanmar               | MN   | Mongolia              | MO   | Macao                 |
| MP   | Northern Mariana      | MQ   | Martinique            | MR   | Mauritania            |
| MS   | Montserrat            | MT   | Malta                 | MU   | Mauritius             |
| MV   | Maldives              | MW   | Malawi                | MX   | Mexico                |
| MY   | Malaysia              | MZ   | Mozambique            | NA   | Namibia               |
| NC   | New Caledonia         | NE   | Niger                 | NF   | Norfolk Island        |
| NG   | Nigeria               | NI   | Nicaragua             | NL   | Netherlands           |
| NO   | Norway                | NP   | Nepal                 | NR   | Nauru                 |
| NU   | Niue                  | NZ   | New Zealand           | OM   | Oman                  |
| PA   | Panama                | PE   | Peru                  | PF   | French Polynesia      |
| PG   | Papua New Guinea      | PH   | Philippines           | PK   | Pakistan              |
| PL   | Poland                | PM   | Saint Pierre          | PN   | Pitcairn              |
| PR   | Puerto Rico           | PS   | Palestine             | PT   | Portugal              |
| PW   | Palau                 | PY   | Paraguay              | QA   | Qatar                 |
| RE   | Réunion               | RO   | Romania               | RS   | Serbia                |
| RU   | Russia                | RW   | Rwanda                | SA   | Saudi Arabia          |
| SB   | Solomon Islands       | SC   | Seychelles            | SD   | Sudan                 |
| SE   | Sweden                | SG   | Singapore             | SH   | Saint Helena          |
| SI   | Slovenia              | SJ   | Svalbard              | SK   | Slovakia              |
| SL   | Sierra Leone          | SM   | San Marino            | SN   | Senegal               |
| SO   | Somalia               | SR   | Suriname              | SS   | South Sudan           |
| ST   | São Tomé              | SV   | El Salvador           | SX   | Sint Maarten          |
| SY   | Syria                 | SZ   | Eswatini              | TC   | Turks & Caicos        |
| TD   | Chad                  | TF   | French Southern       | TG   | Togo                  |
| TH   | Thailand              | TJ   | Tajikistan            | TK   | Tokelau               |
| TL   | Timor-Leste           | TM   | Turkmenistan          | TN   | Tunisia               |
| TO   | Tonga                 | TR   | Turkey                | TT   | Trinidad & Tobago     |
| TV   | Tuvalu                | TW   | Taiwan                | TZ   | Tanzania              |
| UA   | Ukraine               | UG   | Uganda                | UM   | US Minor Outlying     |
| US   | United States         | UY   | Uruguay               | UZ   | Uzbekistan            |
| VA   | Vatican City          | VC   | Saint Vincent         | VE   | Venezuela             |
| VG   | British Virgin        | VI   | US Virgin Islands     | VN   | Vietnam               |
| VU   | Vanuatu               | WF   | Wallis & Futuna       | WS   | Samoa                 |
| XK   | Kosovo                | YE   | Yemen                 | YT   | Mayotte               |
| ZA   | South Africa          | ZM   | Zambia                | ZW   | Zimbabwe              |
