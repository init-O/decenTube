// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract DVideo {
  uint public videoCount = 0;
  string public name = "DVideo";
  
  struct Video{
    uint id;
    string hash;
    string title;
    address author;
    uint like_count;
  }

  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author,
    uint like_count 
  );

  event LikeVideo(
    uint id,
    string hash,
    string title,
    address author,
    uint like_count
  );

  mapping(uint=>Video) public videos;

  constructor() public {
  }

  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length>0,"video hash exits");

    // Make sure video title exists
    require(bytes(_title).length>0,"title hash exits");

    // Make sure uploader address exists
    require(msg.sender!=address(0),"user exits");


    // Increment video id
    videoCount++;
    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender, 0);
    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender, 0);
  }


  function likeVideo(uint  _videoId) external payable {
    require(_videoId>=1 && _videoId<=videoCount, "Video Id must be valid");

    require(msg.sender!=address(0),"valid user");

    Video memory _video = videos[_videoId];
    address(uint160(_video.author)).transfer(msg.value);
    _video.like_count ++;
    videos[_videoId] = _video;

    emit LikeVideo(videoCount, _video.hash, _video.title, msg.sender, _video.like_count);

  }

}
