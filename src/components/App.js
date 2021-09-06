import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import Loader from 'react-loader-spinner'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      account:'0x0',
      dvideo: null,
      videos:[],
      buffer: null,
      currentHash: null,
      currentTitle: '',
      balance:null,
      currentId:null
      //set states
    }

    //Bind functions
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ loading:false})
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts = await web3.eth.getAccounts()

    this.setState({account: accounts[0]})
    var balance = await web3.eth.getBalance(accounts[0])
    balance = await web3.utils.fromWei(balance, "ether")
    this.setState({balance: balance})
    //Add first account the the state

    //Get network ID
    //Get network data
    //Check if net data exists, then
      //Assign dvideo contract to a variable\
      //Add dvideo to the state
    const networkId = await web3.eth.net.getId()
    const networkData = DVideo.networks[networkId]
    if(networkData){
      const dvideo = new web3.eth.Contract(DVideo.abi,networkData.address)
      this.setState({dvideo})
      this.setState({videos:[]})
      const videoCount = await dvideo.methods.videoCount().call()
      for(var i=videoCount; i>=1; i--){
        const video = await dvideo.methods.videos(i).call()
        this.setState({videos:[...this.state.videos,video]})
      }

      const currentVideo = await dvideo.methods.videos(videoCount).call()
      this.setState({currentHash:currentVideo.hash})
      this.setState({currentTitle:currentVideo.title})
      this.setState({currentId:currentVideo.id})

    }else{
      console.log('Contarct Not deployed')
    }
      //Check videoAmounts
      //Add videAmounts to the state
      //Iterate throught videos and add them to the state (by newest)


      //Set latest video and it's title to view as default 
      //Set loading state to false

      //If network data doesn't exisits, log error
  }

  //Get video
  captureFile = event => {
    this.setState({loading: true});
    event.preventDefault();
    const file = event.target.files[0] 
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({buffer:Buffer(reader.result)})
      console.log("video buffer", this.state.buffer)
    }
    this.setState({loading:false})
  }

  //Upload video

  uploadVideo = async title => {
    this.setState({loading:true})
    ipfs.add(this.state.buffer, async (error,result) => {
      if(error){
        console.log(error.message)
        this.setState({loading: false})
        return
      }else{
        await this.state.dvideo.methods.uploadVideo(result[0].hash, title).send({from : this.state.account})
        await this.loadBlockchainData()
        this.setState({loading: false})
      }
    })
  }

  //Change Video
  changeVideo = (hash, title,id) => {
      this.setState({loading: true})
      console.log('changing video',hash,title)
      this.state.currentHash = hash 
      this.state.currentTitle = title  
      this.state.currentId = id
      this.setState({loading:false})
  }

  likeVideo = async (id)=>{
    this.setState({loading:true})
    console.log("liking video..", id)
    await this.state.dvideo.methods.likeVideo(id).send({from :this.state.account, value: window.web3.utils.toWei('1', 'Ether')})
    await this.loadBlockchainData()
    this.setState({loading:false})
  }

  

  render() {
    return (
      <div>
        <Navbar 
          account={this.state.account}
          balance={this.state.balance}
        />
        { this.state.loading
          ? 	<div className="container d-flex justify-content-center w-100 h-100 mt-4">
            <span className="inline align-middle">
              <Loader type="BallTriangle" color="#00BFFF" height={80} width={80} />
            </span>
            </div>
          : <Main
              videos={this.state.videos}
              changeVideo={this.changeVideo}
              currentTitle={this.state.currentTitle}
              currentHash={this.state.currentHash}
              currentId={this.state.currentId}
              captureFile={this.captureFile}
              uploadVideo={this.uploadVideo}
              likeVideo={this.likeVideo}
            />
        }
      </div>
    );
  }
}

export default App;