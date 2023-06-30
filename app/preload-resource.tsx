'use client'

import ReactDOM from 'react-dom'
import { backendUrl } from 'lib/api/backendUrl'
import { endpoint } from 'lib/api/endpoint'

export function PreloadResources(){
    ReactDOM.preload(`${backendUrl}/${endpoint.getServicingHours()}`, {as: 'script'})

    return null
}