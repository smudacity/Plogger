import { apiEndpoint } from '../config'
import { Plog } from '../types/Plog';
import { CreatePlogRequest } from '../types/CreatePlogRequest';
import Axios from 'axios'
import { UpdatePlogRequest } from '../types/UpdatePlogRequest';

export async function getPlogs(idToken: string): Promise<Plog[]> {
  console.log('Fetching Plogs')

  const response = await Axios.get(`${apiEndpoint}/plogs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Plogs:', response.data)
  return response.data.plogs
}

export async function createPlog(
  idToken: string,
  newPlog: CreatePlogRequest
): Promise<Plog> {
  const response = await Axios.post(`${apiEndpoint}/plogs`,  JSON.stringify(newPlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function putPlog(
  idToken: string,
  plogId: string,
  updatedPlog: UpdatePlogRequest
): Promise<void> {
  delete (updatedPlog as any).uploadState
  await Axios.put(`${apiEndpoint}/plogs/${plogId}`, JSON.stringify(updatedPlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletePlog(
  idToken: string,
  PlogId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/plogs/${PlogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  plogId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/plogs/${plogId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  debugger
  await Axios.put(uploadUrl, file)
}
