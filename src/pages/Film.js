// FilmsPage.js
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_ALL_FILMS = gql`
  query GetAllFilms {
    films {
      film_id
      title
      description
      release_year
      language_id
      original_language_id
      rental_duration
      rental_rate
      length
      replacement_cost
      rating
      special_features
      last_update
    }
  }
`;

const GET_FILM_DETAILS = gql`
  query GetFilmDetails($filmId: ID!) {
    film(id: $filmId) {
      film_id
      title
      description
      release_year
      language_id
      original_language_id
      rental_duration
      rental_rate
      length
      replacement_cost
      rating
      special_features
      last_update
    }
  }
`;

const CREATE_FILM = gql`
  mutation CreateFilm(
    $title: String!
    $description: String
    $release_year: Int
    $language_id: Int!
    $rental_duration: Int!
    $rental_rate: Float!
    $replacement_cost: Float!
    $rating: String!
    $special_features: String
  ) {
    addFilm(
      title: $title
      description: $description
      release_year: $release_year
      language_id: $language_id
      rental_duration: $rental_duration
      rental_rate: $rental_rate
      replacement_cost: $replacement_cost
      rating: $rating
      special_features: $special_features
    ) {
      film_id
      title
      description
      release_year
      language_id
      original_language_id
      rental_duration
      rental_rate
      length
      replacement_cost
      rating
      special_features
      last_update
    }
  }
`;

const DELETE_FILM = gql`
  mutation DeleteFilm($filmId: ID!) {
    deleteFilm(id: $filmId)
  }
`;

function FilmsPage() {
  const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [newFilmTitle, setNewFilmTitle] = useState("");
  const [newFilmDescription, setNewFilmDescription] = useState("");
  const [newFilmLanguage, setNewFilmLanguage] = useState(1);
  const [newFilmRD, setNewFilmRD] = useState(7);
  const [newFilmRR, setNewFilmRR] = useState(4.99);
  const [newFilmRC, setNewFilmRC] = useState(9.99);
  const [newFilmRating, setNewFilmRating] = useState("R");

  const {
    loading: filmsLoading,
    error: filmsError,
    data: filmsData,
    refetch: refetchFilms,
  } = useQuery(GET_ALL_FILMS);
  const [createFilm] = useMutation(CREATE_FILM, {
    refetchQueries: [{ query: GET_ALL_FILMS }],
  });
  const [deleteFilm] = useMutation(DELETE_FILM, {
    refetchQueries: [{ query: GET_ALL_FILMS }],
  });

  const {
    loading: filmDetailsLoading,
    error: filmDetailsError,
    data: filmDetailsData,
    refetch: refetchFilmDetails,
  } = useQuery(GET_FILM_DETAILS, {
    variables: { filmId: selectedFilmId },
    skip: !selectedFilmId,
  });

  const handleCreateFilm = async () => {
    try {
      await createFilm({
        variables: {
          title: newFilmTitle,
          description: newFilmDescription,
          language_id: newFilmLanguage,
          rental_duration: newFilmRD,
          rental_rate: newFilmRR,
          replacement_cost: newFilmRC,
          rating: newFilmRating,
        },
      });
      setNewFilmTitle("");
      setNewFilmDescription("");
      setNewFilmLanguage(1);
      setNewFilmRD(7);
      setNewFilmRR(4.99);
      setNewFilmRC(9.99);
      setNewFilmRating("R");
      refetchFilms();
    } catch (error) {
      console.error("Error creating film:", error);
    }
  };

  const handleDeleteFilm = async (filmId) => {
    try {
      await deleteFilm({ variables: { filmId } });
      refetchFilms();
      setSelectedFilmId(null);
    } catch (error) {
      console.error("Error deleting film:", error);
    }
  };

  return (
    <div>
      <h1>All Films</h1>
      {filmsLoading && <p>Loading films...</p>}
      {filmsError && <p>Error fetching films: {filmsError.message}</p>}
      {filmsData && (
        <ul>
          {filmsData.films.map(({ film_id, title }) => (
            <li key={film_id}>
              {title}{" "}
              <button onClick={() => setSelectedFilmId(film_id)}>
                View Details
              </button>{" "}
              <button onClick={() => handleDeleteFilm(film_id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Film Details</h2>
      {selectedFilmId && (
        <>
          {filmDetailsLoading && <p>Loading film details...</p>}
          {filmDetailsError && (
            <p>Error fetching film details: {filmDetailsError.message}</p>
          )}
          {filmDetailsData && (
            <div>
              <p>
                <strong>Title:</strong> {filmDetailsData.film.title}
              </p>
              <p>
                <strong>Description:</strong> {filmDetailsData.film.description}
              </p>
            </div>
          )}
        </>
      )}

      <h2>Create Film</h2>
      <input
        type="text"
        placeholder="Title"
        value={newFilmTitle}
        onChange={(e) => setNewFilmTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={newFilmDescription}
        onChange={(e) => setNewFilmDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Language"
        value={newFilmLanguage}
        onChange={(e) => setNewFilmLanguage(e.target.value)}
      />
      <input
        type="text"
        placeholder="Rental Duration"
        value={newFilmRD}
        onChange={(e) => setNewFilmRD(e.target.value)}
      />
      <input
        type="text"
        placeholder="Rental Rate"
        value={newFilmRR}
        onChange={(e) => setNewFilmRR(e.target.value)}
      />
      <input
        type="text"
        placeholder="Replacement Cost"
        value={newFilmRC}
        onChange={(e) => setNewFilmRC(e.target.value)}
      />
      <input
        type="text"
        placeholder="Film Rating"
        value={newFilmRating}
        onChange={(e) => setNewFilmRating(e.target.value)}
      />
      <button onClick={handleCreateFilm}>Create Film</button>
    </div>
  );
}

export default FilmsPage;
