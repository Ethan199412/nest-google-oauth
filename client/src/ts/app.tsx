import * as React from "react";
import "./app.less";
import { mult, pow } from '../utils'
import { Router, Route, BrowserRouter, Link, Switch, HashRouter } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'

console.log('[p1]', mult(2, 3))
// 需要放 index.d.ts 文件到根目录并在 tsconfig
// includes 里引入才能解决 vscode 报错
import img from "../assets/react.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

console.log('app.tsx 加载')
if (module.hot) {
    module.hot.accept('./app.tsx', () => {
        console.log('[p0] hot module replacement')
    })
}

axios.defaults.withCredentials = true


class App extends React.Component {
    constructor(props: any) {
        super(props);
        console.log('[p1]', module.hot);
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <Switch>
                        <Route path='/login' component={Login} exact />
                        <Route path='/' component={Main} exact />
                    </Switch>
                </BrowserRouter>
            </>
        );
    }
}

function Main() {
    const [showContent, setShowContent] = useState(false)
    useEffect(() => {
        // if (document.cookie.includes('access_token')) {
        //     setShowContent(true)
        //     axios.get('http://localhost:3006/data', {
        //         params: {
        //             email: 'lijiahao@shopee.com'
        //         }
        //     }).then(res => {
        //         console.log('res', res)
        //     })

        //     axios.get('http://localhost:3006/check').then(res => {
        //         console.log('[p1.0] res', res)
        //     })
        // }
    }, [])

    const handleGoogleLogin = () => {
        // const params = new URLSearchParams({
        //     client_id: '581133854653-l9sas35o3vf5kn1qttkvko7d7lqtbcbb.apps.googleusercontent.com',
        //     redirect_uri: 'http://localhost:3005/login',
        //     response_type: 'code',
        //     scope: 'email',
        //     access_type: 'offline'
        // });
        // const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        // window.location.href = url;
        axios.get('http://localhost:3006/google')
    };

    return <>
        {!showContent && <button onClick={handleGoogleLogin}>
            Sign in with Google
        </button>}
        {
            showContent && <div>
                you login successfully, this is content
            </div>
        }
    </>
}

function Login() {
    const getUserInfo = (access_token) => {
        return axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`)
            .then(data => {
                console.log('[p0.6]', data); // 输出用户的 name
                location.href = '/'
                return data;
            });
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('[p0.5] code', code)

        // const clientId = '581133854653-l9sas35o3vf5kn1qttkvko7d7lqtbcbb.apps.googleusercontent.com'
        // const clientSecret = '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'

        // const res = axios.post('https://oauth2.googleapis.com/token', {
        //   code,
        //   client_id: clientId,
        //   client_secret: clientSecret,
        //   redirect_uri: 'http://localhost:3005/login',
        //   grant_type: 'authorization_code'
        // }).then(res=>{
        //     console.log('[p0.7] res', res)
        // })

        axios.get('http://localhost:3006/token', {
            params: {
                code
            }
        }).then(res => {
            console.log('[p0.6] res', res)
        })
        // let query = window.location.href.split('?')[1].split('&')
        // console.log('[p.4]', { query })
        // const obj: any = {}
        // for (let str of query) {
        //     const [key, val] = str?.split('=')
        //     obj[key] = val
        // }
        // console.log('[p0.5]', { obj })
        // document.cookie = `oauth_token = ${obj.access_token}; expires=Fri 31 Dec 9999 23:59:59 GMT; path=/`
        // getUserInfo(obj.access_token)

    }, [])

    const handleBack = () => {
        location.href = '/'
    }

    return <div>login successful
        <button onClick={handleBack}>back</button>
    </div>
}

export default App;