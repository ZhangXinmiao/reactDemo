//评论框
var CommentBox = React.createClass({
  //从服务器端获取数据
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className="commentBox">
        <h1>Comment</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});
//评论列表
var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
//供编辑的评论表单
var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.author.value.trim();
    if(! author || ! text){
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = "";
    this.refs.text.value = "";
    return;
  },
  render: function(){
    return (
      <div className="commentForm" onSubmit={this.handleSubmit}>
        <form>
          <input type="text" placeholder="your name" ref="author" />
          <input type="text" placeholder="say something" ref="text" />
          <input type="submit" value="POST" />
        </form>
      </div>
    );
  }
});
//评论的子节点
var Comment = React.createClass({
  render: function(){
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});
React.render(
  <CommentBox url="../data/data.json" pollInterval={2000} />,
  document.getElementById('content')
);
