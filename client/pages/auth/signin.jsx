import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
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
    <form className="sign-form" onSubmit={onSubmit}>
      <h1>Sign in</h1>
      <div className="sign-form__group">
        <label htmlFor="email">Email Adress</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          type="text"
          placeholder="email"
          id="email"
        />
      </div>
      <div className="sign-form__group">
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="sign-form__group"
          type="password"
          placeholder="password"
          id="password"
        />
      </div>
      {errors}

      <button className="btn-auth">Sign in</button>
    </form>
  );
};

export default signin;
