import { useEffect, useState } from "react"
import { Layout } from "../../components/layouts"
import { FavoritePokemons } from "../../components/pokemon"
import { NoFavorites } from "../../components/ui"
import { localFavorites } from "../../utils"

const Favorites = () => {

  const [ favoritePokomons, setFavoritePokomons ] = useState<number[]>([])

  useEffect(() => {
    setFavoritePokomons(localFavorites.pokemons())
  }, [])

  return (
    <Layout title="Favoritos">
      {
        favoritePokomons.length === 0
          ? <NoFavorites />
          : <FavoritePokemons pokemons={ favoritePokomons } />
      }
    </Layout>
  )
}


export default Favorites
