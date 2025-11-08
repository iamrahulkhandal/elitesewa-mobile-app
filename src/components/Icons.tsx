import { View, Text } from 'react-native'
import React from 'react'
import type { PropsWithChildren } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

type IconsProps = PropsWithChildren<{
   name:string,
   font:number,
}>

const Icons = ({name,font} : IconsProps) => {
       return <Icon name={name} size={font} />
   }

export default Icons