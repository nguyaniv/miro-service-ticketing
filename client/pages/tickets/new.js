import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';
import Image from 'next/image';
const NewTicket = () => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [movie, setMovie] = useState({});
  const [stage, setStage] = useState('title');
  const [movieSearch, setMovieSearch] = useState('');

  const router = useRouter();
  const [moviesResults, setMoviesResults] = useState([]);

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title: movie.title,
      description: movie.description,
      image: movie.image,
      price,
      date,
      location,
      quantity,
    },
    onSuccess: (ticket) => router.push('/'),
  });

  const onLookMovieName = async (e) => {
    setMovieSearch(e.target.value);
    if (movieSearch.split('').length >= 2) {
      const res = await fetch(
        `https://imdb-api.com/en/API/Search/k_icf9u8ml/${movieSearch}`
      );
      const data = await res.json();
      setMoviesResults(data.results);
    }
  };

  const onSubmit = () => {
    doRequest();
  };
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSetMovie = async (movie) => {
    setMovie(movie);
    onChangeStage('location');
  };
  const onLookMovieLocation = async (e) => {
    setLocation(e.target.value);
  };

  const setContent = () => {
    if (stage === 'title') {
      return searchTitle;
    } else if (stage === 'location') {
      return searchLocation;
    } else if (stage === 'price') {
      return ticketPriceForm;
    }
  };

  const onChangeStage = (key) => {
    if (key === 'title') {
      setStage('title');
    } else if (key === 'location') {
      setStage('location');
    } else if (key === 'price') {
      setStage('price');
    } else {
      throw console.error('there is no such thing as ' + key);
    }
  };

  const searchTitle = (
    <div className="ticket-form__title">
      <h1>Step 1/3 : Movie's Title</h1>
      <input
        value={movieSearch}
        onChange={(e) => onLookMovieName(e)}
        placeholder="Movie's name"
      />
      <ul className="ticket-form__results">
        {moviesResults &&
          moviesResults.length > 0 &&
          moviesResults.map((movie) => {
            return (
              <li onClick={() => onSetMovie(movie)} key={movie.key}>
                <h5>{movie.title}</h5>
                <Image width={100} height={150} src={movie.image} />
              </li>
            );
          })}
      </ul>
    </div>
  );

  const searchLocation = (
    <div className="ticket-form__location">
      <h1>Step 2/3 Movie's Theater Adress and Date</h1>
      <input
        value={location}
        onChange={(e) => onLookMovieLocation(e)}
        placeholder="Movie's Location Adress"
      />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="form-control"
      />
      <div className="ticket-form__btns">
        <button
          onClick={(e) => {
            e.preventDefault();
            onChangeStage('title');
          }}
        >
          Prev
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onChangeStage('price');
          }}
        >
          Next
        </button>
      </div>
    </div>
  );

  const ticketPriceForm = (
    <div className="ticket-form__price">
      <h1>Step 3/3 Movie's price</h1>

      <div className="ticket-form__price--inputs">
        <div>
          <label htmlFor=""> how many tickets would you like to sell ?</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="quantinty"
            onBlur={onBlur}
          />
        </div>

        <div>
          <label htmlFor="">price per ticket</label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="price"
            onBlur={onBlur}
          />
        </div>
      </div>

      <div className="ticket-form__btns">
        <button
          onClick={(e) => {
            e.preventDefault();
            onChangeStage('location');
          }}
        >
          Prev
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          Finish
        </button>
      </div>
    </div>
  );

  const content = setContent();

  return (
    <div className="ticket-form">
      <h1>Create a Ticket</h1>
      <form>{content}</form>
    </div>
  );
};

export default NewTicket;
