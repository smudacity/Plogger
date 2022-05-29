import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { putPlog} from '../api/plogs-api'

enum UploadState {
  NoUpload,
  UploadingDetails
}

interface EditPlogProps {
  match: {
    params: {
      plogId: string
    }
  }
  auth: Auth
}

interface EditPlogState {
  title: string,
  location: string,
  comments: string
  uploadState: UploadState
}

export class EditPlogDetails extends React.PureComponent<
  EditPlogProps,
  EditPlogState
> {
  state: EditPlogState = {
    title:'',
    comments:'',
    location: '',
    uploadState: UploadState.NoUpload
  }
  constructor(props: any){
    super(props)
    this.state =  {
      title: (this.props as any).location?.state.title,
      location: (this.props as any).location?.state.location,
      comments: (this.props as any).location?.state.comments,
      uploadState: UploadState.NoUpload
    }
  }


  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {

      this.setUploadState(UploadState.UploadingDetails)
      await putPlog(this.props.auth.getIdToken(), this.props.match.params.plogId, this.state)

      alert('Details are updated!')
    } catch (e: any) {
      alert('Could not update the details: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }


  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({ title: event.target.value })
  }
  handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({ comments: event.target.value })
  }
  handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({ location: event.target.value })
  }
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter new Title"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Comments</label>
            <input
              type="text"
              placeholder="Enter new comments"
              value={this.state.comments}
              onChange={this.handleCommentsChange}
            />
          </Form.Field>
          
          <Form.Field>
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter new location"
              value ={this.state.location}
              onChange={this.handleLocationChange}
            />
          </Form.Field>
          

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.UploadingDetails && <p>Updating plog details</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Update Details
        </Button>
      </div>
    )
  }
}
