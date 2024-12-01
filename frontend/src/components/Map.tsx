'use client';

import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import './widgets.css'
import { Cartesian3, Color } from 'cesium';

const Cesium = dynamic(
  () => import('./Cesium'),
  { ssr: false }
)

interface IonProps {
  className?: string;
  polyline?: boolean;
  name?: any;
  width?: any;
  material?: any;
  positions: {
      position: number[];
      name: string;
  }[]
}

export default function Map(props: IonProps) {

  const { className, name, polyline, width, material, positions } = props

  if (polyline && positions.length !== 2) {
    throw Error("Polyline must have exactly two positions")
  }

  return (
    <>
      <div className={className}>
        <Cesium className={className} polyline={polyline} pins={positions} name={name} positions={(positions.length > 0) ? positions[0].position.concat(positions[1].position) : undefined} width={width} material={material} />
      </div>
    </>
  )
}