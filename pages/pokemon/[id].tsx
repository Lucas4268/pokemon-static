import { Button, Card, Container, Grid, Image, Text } from "@nextui-org/react"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useState } from "react"
import { pokeApi } from "../../api"
import { Layout } from "../../components/layouts"
import { Pokemon } from "../../interfaces"
import { getPokemonInfo, localFavorites } from "../../utils"

import confetti from 'canvas-confetti'

// esta pagina tiene incremental static generation ISG, para que se rendericen nuevos pokemons (en produccion) que no estan definidos estaticamente

interface Props {
  pokemon: Pokemon
}

const PokemonPage: NextPage<Props> = ({ pokemon }) => {

  const [ isInFavorites, setIsInFavorites ] = useState( localFavorites.existsInFavorites(pokemon.id) )

  const onToggleFavorite = () => {
    localFavorites.toggleFavorites(pokemon.id)
    setIsInFavorites( !isInFavorites )

    if ( !isInFavorites ) {
      confetti({
        zIndex: 100,
        particleCount: 100,
        spread: 160,
        angle: -100,
        origin: {
          x: 1,
          y: 0
        }
      })
    }
  }

  return (
    <Layout title={ pokemon.name }>
      <Grid.Container css={{ marginTop: '5px' }} gap={ 2 }>
        <Grid xs={ 12 } sm={ 4 }>
          <Card hoverable css={{ padding: '30px' }}>
            <Card.Body>
              <Card.Image
                src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png' }
                alt={ pokemon.name }
                width="100%"
                height={ 200 }
              />
            </Card.Body>
          </Card>
        </Grid>

        <Grid xs={ 12 } sm={ 8 }>
          <Card>
            <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text h1 transform="capitalize">{ pokemon.name }</Text>

              <Button
                color="gradient"
                ghost={ !isInFavorites }
                onClick={ onToggleFavorite }
              >
                { isInFavorites ? 'En favoritos' : 'Guardar en favoritos' }
              </Button>
            </Card.Header>

            <Card.Body>
              <Text size={ 30 }> Sprites: </Text>

              <Container display="flex" direction="row" > 
                <Image
                  src={ pokemon.sprites.front_default }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />
                <Image
                  src={ pokemon.sprites.back_default }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />
                <Image
                  src={ pokemon.sprites.front_shiny }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />
                <Image
                  src={ pokemon.sprites.back_shiny }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Layout>
  )
}





export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const pokemons151 = [...Array(151)].map((_, i) =>({ params: { id: `${ i + 1 }` } }))

  return {
    // paths: [
    //   {
    //     params: { id: "1" }
    //   }
    // ],
    // fallback: "blocking" // el "blocking" deja que se ingrese a las rutas que no están definidas en paths

    paths: pokemons151,
    // fallback: false // asi da un 404
    fallback: 'blocking'
  }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { id } = params as { id: string }
  
  const pokemon = await getPokemonInfo( id )

  if (!pokemon) {
    return {
      redirect:{
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      pokemon,
    },
    revalidate: 10 // la pagina se revalida cada 10 segundos
  }
}


export default PokemonPage

