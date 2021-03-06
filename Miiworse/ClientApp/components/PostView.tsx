import * as React from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment = require('moment');
import Img from 'react-image';
import { AppState, PagedResults, Post } from '../appState';
import VisibilitySensor = require('react-visibility-sensor');
import { Link } from 'react-router-dom';
import * as he from 'he';

@observer
export class PostView extends React.Component<{post: Post, isReply?: boolean}, {}> { 
    
    renderPlayed(isPlayed) {
        if (!isPlayed) return <div></div>;
        return (
            <div className="played symbol">
                <span className="symbol-label">Played</span>
            </div>
        )
    }

    renderImage(imageUri: string, isDrawing: boolean) {
        if (imageUri == "") return <div></div>
        let missing = isDrawing ? '/img/missing-drawing.png' : '/img/missing.png';
        let loading = isDrawing ? '/img/placeholder-drawing.png' : '/img/placeholder.png';
        return <Img 
        className="post-memo"
            src={["https://web.archive.org/web/20171110012107if_/" + imageUri, missing]}
            loader={<img className="post-memo placeholder"
                src={loading}></img>}
        ></Img>
    }

    renderVideo(videoUrl: string) {
        return <iframe className="youtube-embed" src={videoUrl} frameBorder="0" allowFullScreen></iframe>
    }

    renderScreenname(screenname: string) {
        return screenname == null || screenname == '' ? "(Hidden)" : he.decode(screenname);
    }

    render() {
        let post = this.props.post;
        let header = !this.props.isReply ? <header className="community-container">
            <h1 className="community-container-heading">
                <Link to={`/games/${post.gameId}`}>
                    <Img className="community-icon"
                        src={"https://web.archive.org/web/20171110012107if_/" + post.gameCommunityIconUri}
                        loader={<img className="community-icon"
                            src="/img/spinner.gif"></img>}
                    ></Img>
                    {post.gameCommunityTitle}
                </Link>
            </h1>
        </header> : <div></div>;
        return (
            <div>
                {header}
                <div className="user-content"> 
                    <a className="icon-container">
                        <Img className="icon" 
                        src={["https://web.archive.org/web/20171110012107if_/" + post.iconUri, '/img/anonymous-mii.png']}
                        loader={<img
                        className="icon" 
                        src="/img/spinner.gif"></img>}
                        ></Img>
                    </a>
                    <div className="user-name-content">
                        <p className="user-name">
                            <Link to={`/users/${post.name}`}>{this.renderScreenname(post.screenName)}</Link>
                            <span className="user-id">{post.name}</span>
                        </p>
                        <p className="timestamp-container">
                            <a href={`https://web.archive.org/https://miiverse.nintendo.net/posts/${post.id}`} target='_blank'>
                                <span className="timestamp">
                                    {moment.unix(post.postedDate).format('dddd, MMMM Do, YYYY h:mm:ss A')}
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
                <div className="body">
                    <p className="post-content-memo">
                        <p>{post.text}</p>
                        <p>{post.title}</p>
                        {this.renderImage(post.screenShotUri, false)}
                        {this.renderImage(post.imageUri, true)}
                    </p>
                    {post.videoUrl != null && post.videoUrl != '' ? this.renderVideo(post.videoUrl) : <div />}
                    <div className="post-meta">
                        <div className="empathy symbol">
                            <span className="symbol-label">Yeahs</span>
                            <span className="empathy-count">{post.empathyCount}</span>
                        </div>
                        <div className="reply symbol">
                            <span className="symbol-label">Comment</span>
                            <span className="reply-count">{post.replyCount}</span>
                        </div>
                        {this.renderPlayed(post.isPlayed)}
                    </div>
                    <div style={{fontSize: "13px"}}>
                        <a href={`https://archive.org/details/${post.warcLocation}`} target="_blank">View WARC</a>
                    </div>
                </div>
            </div>
        );
    }
}