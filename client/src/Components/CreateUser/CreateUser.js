import { useState } from "react";

import "./CreateUser.css";
import astronauta from "../../default-avatars/astronauta.png";
import hacker from "../../default-avatars/hacker.png";
import niña1 from "../../default-avatars/nina-1.png";
import niña2 from "../../default-avatars/nina-2.png";
import niña3 from "../../default-avatars/nina-3.png";
import niña4 from "../../default-avatars/nina-4.png";
import ninja from "../../default-avatars/ninja.png";
import rey from "../../default-avatars/rey.png";
import noAvatar from "../../default-avatars/no-avatar.png";

const avatarsCollection = [
   astronauta,
   hacker,
   niña1,
   niña2,
   niña3,
   niña4,
   ninja,
   rey,
];

function CreateUserName({ setName }) {
   const [inputValue, setValue] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      setName(inputValue);
   };

   return (
      <section className='welcome-page' data-testid='username-page'>
         <div className='welcome__container'>
            <div className='welcome__title'>
               <h1>Welcome!</h1>
            </div>
            <div className='create-name-container'>
               <form className='form' onSubmit={(e) => handleSubmit(e)}>
                  <div className='form-label'>
                     <label htmlFor='user-name'>Your name:</label>
                  </div>
                  <div className='form-input'>
                     <input
                        type='text'
                        required
                        maxLength={30}
                        id='user-name'
                        value={inputValue}
                        onChange={(e) => setValue(e.target.value)}
                     />
                  </div>
                  <div className='form-btn'>
                     <button type='submit'>Next</button>
                  </div>
               </form>
            </div>
         </div>
      </section>
   );
}

function CreateUserAvatar({ avatar, setAvatar, join }) {
   return (
      <section className='avatar-page' data-testid='avatar-page'>
         <div className='avatar__title'>
            <h1>Pick an avatar!</h1>
         </div>
         <div className='avatar__container'>
            <div className='avatar__preview'>
               <img
                  src={avatar ? avatar : noAvatar}
                  className='avatar-image'
                  alt='Avatar preview'
                  loading='lazy'
               />
               <div className='join-btn-container'>
                  {avatar ? (
                     <button onClick={() => join()}>Join!</button>
                  ) : null}
               </div>
            </div>
            <div className='default-avatars'>
               <div className='collection'>
                  {avatarsCollection.map((avatarSrc, index) => {
                     return (
                        <img
                           key={index}
                           src={avatarSrc}
                           alt='User avatar'
                           className='avatar-image'
                           loading='lazy'
                           onClick={(e) => {
                              setAvatar(e.target.src);
                           }}
                        />
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
}

function CreateUser({ joinChat }) {
   const [userName, setName] = useState("");
   const [userAvatar, setAvatar] = useState("");

   const join = () => {
      joinChat(userName, userAvatar);
   };

   return !userName ? (
      <CreateUserName setName={setName} />
   ) : (
      <CreateUserAvatar avatar={userAvatar} setAvatar={setAvatar} join={join} />
   );
}

export default CreateUser;
