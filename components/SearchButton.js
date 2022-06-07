import { css } from '@emotion/css'

export function SearchButton({
  buttonText,
  onClick
}) {
  return (
    <button
      className={buttonStyle}
      onClick={onClick}
    >{buttonText}</button>
  )
}

export function GoLiveButton({
  onClick,
  buttonText
}) {
  return (
    <button
      className={goLiveBtnStyle}
      onClick={onClick}
    >{buttonText}</button>
  )
}

const goLiveBtnStyle = css`
border: none;
outline: none;
margin-left: 15px;
background-color: black;
color: #fff;
padding: 17px;
border-radius: 25px;
cursor: pointer;
font-size: 14px;
font-weight: 500;
background-color: #4d60eb;
transition: all .35s;
width: 240px;
letter-spacing: .75px;
&:hover {
  background-color: #3744a3;
}
`

const buttonStyle = css`
border: none;
outline: none;
margin-left: 15px;
background-color: black;
color: #340036;
padding: 17px;
border-radius: 25px;
cursor: pointer;
font-size: 14px;
font-weight: 500;
background-color: rgb(249, 92, 255);
transition: all .35s;
width: 240px;
letter-spacing: .75px;
&:hover {
  background-color: rgba(249, 92, 255, .75);
}
`