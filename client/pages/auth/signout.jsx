import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
const signout = () => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out. . .</div>;
};

export default signout;
