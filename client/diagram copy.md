@startuml
FE -> FE: route /: FE cookie has access_token? if no, redirect
FE -> GoogleOauthFE: redirect to https://accounts.google.com/o/oauth2/v2/auth
GoogleOauthFE -> FE: if login success，redirect to url: http://localhost:3005/login，redirect url has code and FE would extract
FE -> BE: route: /login，send request to BE /oauth/toke with code
BE -> GoogleOauthBE: request https://accounts.google.com/o/oauth2/token using code to exchange token, including access_token and refresh_token
BE -> GoogleOauthBE: request https://www.googleapis.com/oauth2/v1/userinfo with access_token to get user info, including email
database MySQL
BE -> MySQL: save {email,access_token,refresh_token} to DB
BE -> FE: set cookie: access_token

FE -> BE: if FE send business request, check access_token expired or not, using endpoint https://www.googleapis.com/oauth2/v1/userinfo
BE -> MySQL: if expired get refresh_token from db
BE -> GoogleOauthBE: using refresh_token to get access_token. endpoint: https://accounts.google.com/o/oauth2/token or https://oauth2.googleapis.com/token 
BE -> MySQL: save new access_token
BE -> FE: inject access_token to FE cookie

@enduml