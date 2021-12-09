import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>sign up bro</h1>
      <div className="form-group">
        <label htmlFor="">Email Adress</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          type="text"
        />
      </div>
      <div className="form-group">
        <label htmlFor="">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          type="password"
        />
      </div>
      {errors}

      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default signup;
