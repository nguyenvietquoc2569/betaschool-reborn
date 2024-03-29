import { CButton } from '@betaschool-reborn/coreui-lib';
import React, { useEffect, useState } from 'react';
const useMultiAudio = urls => {
  const [sources, setSource] = useState(
    urls.map(url => {
      return {
        url,
        audio: new Audio(url),
      }
    }),
  )

  const [players, setPlayers] = useState(
    urls.map(url => {
      return {
        url,
        playing: false,
      }
    }),
  )

  const toggle = targetIndex => () => {
    const newPlayers = [...players]
    const currentIndex = players.findIndex(p => p.playing === true)
    if (currentIndex !== -1 && currentIndex !== targetIndex) {
      newPlayers[currentIndex].playing = false
      newPlayers[targetIndex].playing = true
    } else if (currentIndex !== -1) {
      newPlayers[targetIndex].playing = false
    } else {
      newPlayers[targetIndex].playing = true
    }
    setPlayers(newPlayers)
  }

  useEffect(() => {
    sources.forEach((source, i) => {
      players[i].playing ? source.audio.play() : source.audio.pause()
    })
  }, [sources, players])

  useEffect(() => {
    sources.forEach((source, i) => {
      source.audio.addEventListener('ended', () => {
        const newPlayers = [...players]
        newPlayers[i].playing = false
        setPlayers(newPlayers)
      })
    })
    return () => {
      sources.forEach((source, i) => {
        source.audio.removeEventListener('ended', () => {
          const newPlayers = [...players]
          newPlayers[i].playing = false
          setPlayers(newPlayers)
        })
      })
    }
  }, [])

  return [players, toggle]
}

export const MultiPlayer = ({ urls }) => {
  const [sources, setSource] = useState<Array<any>>([])
  const [players, setPlayers] = useState<Array<any>>([])

  useEffect(() => {
    setSource(urls.map(url => {
      return {
        url,
        audio: new Audio(url),
      }
    }))
    setPlayers(urls.map(url => {
      return {
        url,
        playing: false,
      }
    }))
  }, [urls])

  const toggle = targetIndex => () => {
    const newPlayers = [...players]
    const currentIndex = players.findIndex(p => p.playing === true)
    if (currentIndex !== -1 && currentIndex !== targetIndex) {
      newPlayers[currentIndex].playing = false
      newPlayers[targetIndex].playing = true
    } else if (currentIndex !== -1) {
      newPlayers[targetIndex].playing = false
    } else {
      newPlayers[targetIndex].playing = true
    }
    setPlayers(newPlayers)
  }

  useEffect(() => {
    sources.forEach((source, i) => {
      players[i].playing ? source.audio.play() : source.audio.pause()
    })
  }, [sources, players])

  useEffect(() => {
    sources.forEach((source, i) => {
      source.audio.addEventListener('ended', () => {
        const newPlayers = [...players]
        newPlayers[i].playing = false
        setPlayers(newPlayers)
      })
    })
    return () => {
      sources.forEach((source, i) => {
        source.audio.removeEventListener('ended', () => {
          const newPlayers = [...players]
          newPlayers[i].playing = false
          setPlayers(newPlayers)
        })
      })
    }
  }, [sources])

  return (
    <div>
      {players.map((player, i) => (
        <Player key={i} id={i} player={player} toggle={toggle(i)} />
      ))}
    </div>
  )
}

const Player = ({ player, toggle, key, id }) => (
  <div>
    Recording {id}: 
    <CButton color={player.playing? "success":"secondary"} onClick={toggle}>{player.playing ? 'Pause' : 'Play'}</CButton>
  </div>
)
