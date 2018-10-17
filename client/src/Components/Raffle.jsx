import React, { Component } from 'react';
import axios from 'axios';
import {
  Card,
  Image,
  Header,
  Input,
  Button,
  List,
  Form,
  Message
} from 'semantic-ui-react';

class Raffle extends Component {
  state = {
    winner: {},
    secret: '',
    buttonLoading: false,
    buttonDisabled: true,
    msg: {}
  }

  fetchRaffleWinner = () => {
    const { secret } = this.state
    this.setState({ buttonLoading: true })

    axios.post('/raffle', { secret })
      .then(({ data }) => {
        if (data.type === 'FORBIDDEN') {
          this.setState({
            msg: data,
            buttonLoading: false,
            secret: ''
          })
        } else {
          this.setState({
            winner: data,
            buttonLoading: false
          })
        }
      })
      .catch(err => {
        console.log('Error picking winner', err);
      })
  }

  fetchNumberOfParticipants = () => {
    axios.get('/users/total')
      .then(({ data }) => {
        this.setState({
          numberOfParticipants: data.count,
        })
      })
      .catch(err => {
        console.log('Error fetching # of participants', err);
      })
  }

  componentDidMount = () => {
    this.fetchNumberOfParticipants();
  }

  handleInput = (e, { value }) => {
    let buttonDisabled = false;

    if (value === '') {
      buttonDisabled = true
    }

    this.setState({
      secret: value,
      buttonDisabled
    })
  }

  renderCard = () => {
    const { winner } = this.state;
    if (winner.id) {
      return (
        <Card fluid>
          <Image src='https://media2.giphy.com/media/ehhuGD0nByYxO/giphy.gif?cid=3640f6095bc7959a774435562eb3e276' />
          <Card.Content>
            <Card.Header>{winner.name + ' ' + winner.lastname}</Card.Header>
            <Card.Meta>
              <span className='date'>{`Registered in ${winner.registered_at}`}</span>
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <List>
              <List.Item icon='hashtag' content={winner.id} />
              <List.Item icon='mail' content={winner.email} />
              <List.Item icon='phone' content={winner.phone} />
            </List>
          </Card.Content>
        </Card>
      )
    } else {
      return null
    }
  }

  render() {
    const { buttonLoading, buttonDisabled, secret, msg } = this.state;
    return (
      <div>
        <Header as='h2'>Raffle: </Header>
        <div className='raffle-container'>
          {this.renderCard()}
          <Form onSubmit={this.fetchRaffleWinner} error={!msg.success}>
            <Input
              fluid
              icon='key'
              iconPosition='left'
              placeholder='Secret word'
              onChange={this.handleInput}
              value={secret}
            />
            <br />
            <Button
              fluid
              positive
              disabled={buttonDisabled}
              loading={buttonLoading}
              content='Pick a Winner'
            />
            <Message
              error={!msg.success}
              header={msg.title}
              content={msg.content}
            />
          </Form >
        </div>
      </div>
    )
  }
}

export default Raffle;