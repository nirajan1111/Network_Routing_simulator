import Earth from '../Earth/Earth'
import { MyProvider } from '../../Context/ContextProvider'
export default function threeD() {

  return (
    
    <MyProvider>
      <Earth />
    </MyProvider>
  )
}
