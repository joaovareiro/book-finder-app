import React from 'react'
import { Container, Content } from './styles'
import { 
  FaTimes, 
  FaPlus,
  FaBook
} from 'react-icons/fa'

import SidebarItem from '../SidebarItem'

const Sidebar = ({ active }) => {

  const closeSidebar = () => {
    active(false)
  }

  return (
    <Container sidebar={active}>
      <FaTimes onClick={closeSidebar} />  
      <Content>
        <SidebarItem Icon={FaBook} Text="Auto Ajuda" />
        <SidebarItem Icon={FaBook} Text="Biografias" />
        <SidebarItem Icon={FaBook} Text="Contos" />
        <SidebarItem Icon={FaBook} Text="Ficção Científica" />
        <SidebarItem Icon={FaBook} Text="Folclore" />
        <SidebarItem Icon={FaBook} Text="Horror" />
        <SidebarItem Icon={FaPlus} Text="Ver mais" />
      </Content>
    </Container>
  )
}

export default Sidebar