@startuml
FE -> FE: 路由/: 有 cookie 吗？没有，则重定向
FE -> GoogleOauthFE: 重定向 https://accounts.google.com/o/oauth2/v2/auth
GoogleOauthFE -> FE: 登录成功，跳转回重定向 url: http://localhost:3005/login，重定向 url 上有 code，FE 把它成功拿到
FE -> BE: FE路由: /login，发送 axios 请求到 BE 的 /oauth/token，带上 code
BE -> GoogleOauthBE: axios https://accounts.google.com/o/oauth2/token 用 code 换 token，包括 access_token 和 refresh_token
BE -> GoogleOauthBE: axios https://www.googleapis.com/oauth2/v1/userinfo 用 access_token 换用户信息，包含最重要的 email
database MySQL
BE -> MySQL: save {email,access_token,refresh_token} to DB
BE -> FE: set cookie: access_token

FE -> BE: 发送其他业务请求，先检查 access_token 是否过期，即，https://www.googleapis.com/oauth2/v1/userinfo
BE -> MySQL: 如果过期，从数据库中获得 refresh_token，
BE -> GoogleOauthBE: 利用 refresh_token 到 https://accounts.google.com/o/oauth2/token 或者 https://oauth2.googleapis.com/token 得到 access_token
BE -> MySQL: 写入新的 access_token
BE -> FE: 把新的 access_token 注入到前端的 cookie

@enduml