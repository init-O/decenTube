import React, { Component } from 'react';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoTitle:''
    }
  }

  render() {
    return (
      <div className="container-fluid text-monospace">
      <br></br>
      &nbsp;
      <br></br>
        <div className="row">
          <div className="col-md-10">
            <div className="embed-responsive embed-responsive-16by9" >
              <iframe className="m-2 px-2 py-2 w-50" src={`https://ipfs.infura.io/ipfs/${this.props.currentHash}`} frameborder="0"></iframe>
            </div>
            <h3>{this.props.currentTitle}</h3>
            <button className="btn btn-info ml-4 px-3 py-2" onClick={()=>this.props.likeVideo(this.props.currentId)}>Like</button>
          </div>
          <div className="col-md-2 text-center">
            <h5><b>Share Video</b></h5>
            <form onSubmit={(event) => {
              event.preventDefault();
              console.log("yaha tak sahi chala....", this.state.videoTitle)
              this.props.uploadVideo(this.state.videoTitle)
            }} >
              &nbsp;
              <input type="file" accept=".mp4 .mkv .avi .mov"className="m-2 px-2" onChange={this.props.captureFile} />
              <div className="form-group mr-sm-2">
                <input type="text" id="videoTitle" className="form-control-sm" required placeholder='Title....' onChange={(input)=>this.state.videoTitle = input.target.value}/>
              </div>
              <button type="submit" className="btn btn-danger btn-sm">Upload</button>
              &nbsp;
            </form>
            {/* Map Video...*/}
            {
              this.props.videos.map(video => {
                return(
                  <div style={{ width: '175px'}}>
                    <div className="card-title bg-dark">
                      <small className="text-white"><b>{video.title}</b></small>
                    </div>
                      <div>
                        <p onClick={()=>this.props.changeVideo(video.hash,video.title, video.id)}>
                          <iframe src={`https://ipfs.infura.io/ipfs/${video.hash}`} style={{width:"150px"}}/>
                        </p>
                        {/* Change Video...*/}
                        {/* Return Side Videos...*/}
                      </div>
                  </div>
                )

              })
            }
              {/* Return Video...*/}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;