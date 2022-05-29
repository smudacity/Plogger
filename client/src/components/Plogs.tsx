import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createPlog, deletePlog, getPlogs, putPlog } from '../api/plogs-api'
import Auth from '../auth/Auth'
import { Plog } from '../types/Plog'

interface PlogsProps {
  auth: Auth
  history: History
}

interface PlogsState {
  loadingPlogs: boolean
  plogs: Plog[]
  newPlogTitle: string
  newPlogComments: string
  newPlogLocation: string
}

export class Plogs extends React.PureComponent<PlogsProps, PlogsState> {
  state: PlogsState = {
    plogs: [],
    newPlogTitle: '',
    newPlogComments: '',
    newPlogLocation: '',
    loadingPlogs: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({ newPlogTitle: event.target.value })
  }
  handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({ newPlogComments: event.target.value })
  }
  handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({ newPlogLocation: event.target.value })
  }

  onEditButtonClick = (plogId: string) => {
    this.props.history.push(`/plogs/${plogId}/edit`)
  }
  onEditDetailsButtonClick = (plog: Plog) => {
    this.props.history.push(`/plogs/${plog.plogId}/editDetails`,  plog)
  }

  onPlogCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newPlog = await createPlog(this.props.auth.getIdToken(), {
        title: this.state.newPlogTitle,
        comments: this.state.newPlogComments,
        location: this.state.newPlogLocation
      })
      this.setState({
        plogs: [...this.state.plogs, newPlog],
        newPlogTitle: '',
        newPlogComments: '',
        newPlogLocation: ''
      })
    } catch {
      alert('Plog creation failed')
    }
  }

  onPlogDelete = async (plogId: string) => {
    try {
      await deletePlog(this.props.auth.getIdToken(), plogId)
      this.setState({
        plogs: this.state.plogs.filter(Plog => Plog.plogId !== plogId)
      })
    } catch {
      alert('Plog deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const plogs = await getPlogs(this.props.auth.getIdToken())
      this.setState({
        plogs: plogs,
        loadingPlogs: false
      })
    } catch (e: any) {
      alert(`Failed to fetch Plogs: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Plogs</Header>

        {this.renderCreatePlogInput()}

        {this.renderPlogs()}
      </div>
    )
  }

  renderCreatePlogInput() {
    return (
      <Grid.Row>
        <Grid.Column >
          <Input width={5}
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onPlogCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleTitleChange}
          />
          <Input width={5}

            fluid
            placeholder="comments..."
            onChange={this.handleCommentsChange}
          />
          <Input width={5}

            fluid
            placeholder="location"
            onChange={this.handleLocationChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPlogs() {
    if (this.state.loadingPlogs) {
      return this.renderLoading()
    }

    return this.renderPlogsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Plogs
        </Loader>
      </Grid.Row>
    )
  }

  renderPlogsList() {
    return (
      <Grid padded>
        {this.state.plogs.map((plog, pos) => {
          return (
            <Grid.Row key={plog.plogId}>
              <Grid.Column width={2} floated="left">
                {dateFormat(plog.createdAt, 'yyyy-mm-dd HH:mm:ss') }
              </Grid.Column>
              <Grid.Column width={1} floated="left">
              {plog.location}
              </Grid.Column>

              <Grid.Column width={2} >
                {plog.title}
              </Grid.Column>
              
              <Grid.Column width={3} floated="left">
                {plog.comments}
              </Grid.Column>
              
              <Grid.Column width={1} floated="left">
                <Grid.Row>
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(plog.plogId)}
                >
                  <Icon name="paperclip" />
                </Button>
              
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditDetailsButtonClick(plog)}
                >
                  <Icon name="pencil" />
                </Button>
              
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPlogDelete(plog.plogId)}
                >
                  <Icon name="delete" />
                </Button>
                </Grid.Row>
                
              </Grid.Column>
              {plog.attachmentUrl && (
                <Image src={plog.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
