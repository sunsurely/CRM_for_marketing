import styled from '@emotion/styled';
import { TextField, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Styled components
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SigninForm = styled.form`
  width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;

const WelcomeContainer = styled.div`
  text-align: center;
  font-size: 24px;
  color: #333;
`;

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 로드 시 쿠키에서 JWT 토큰 확인
    const token = Cookies.get('jwt');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3005/auth/signin', {
        email,
        password,
      });

      // JWT 토큰을 쿠키에 저장
      Cookies.set('jwt', response.data.accessToken, { expires: 1, path: '' });

      // 로그인 상태 변경
      setIsLoggedIn(true);

      // 입력 필드 초기화
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // 쿠키에서 JWT 토큰 제거
    Cookies.remove('jwt');
    setIsLoggedIn(false);
  };

  return (
    <Container>
      {isLoggedIn ? (
        <WelcomeContainer>
          <h1>환영합니다!</h1>
          <p>로그인 상태입니다.</p>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        </WelcomeContainer>
      ) : (
        <SigninForm onSubmit={handleLogin}>
          <TextField
            label="이메일"
            type="email"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="off"
          />
          <TextField
            label="패스워드"
            type="password"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '로그인'
            )}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </SigninForm>
      )}
    </Container>
  );
};

export default SigninPage;
