import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Profile({ username }) {
  const { contactId } = useParams();
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    gender: '',
    email: '',
    jobTitle: '',
    favouriteColour: '',
    profileImage: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const url = `https://boolean-uk-api-server.fly.dev/${username}/contact/${contactId}`;
        console.log('Fetching URL:', url); // Log the URL
        const response = await fetch(url);
        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Data:', data); // Log the data
        setContact(data);
      } catch (error) {
        console.error('Error fetching contact:', error); // Log the error
        setError(error);
      }
    };

    fetchContact();
  }, [contactId, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `https://boolean-uk-api-server.fly.dev/${username}/contact/${contactId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Updated data:', data); // Log the updated data
      setContact(data);
    } catch (error) {
      console.error('Error updating contact:', error); // Log the error
      setError(error);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!contact) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <form onSubmit={handleSubmit}>
        <img src={contact.profileImage} alt={`${contact.firstName} ${contact.lastName}`} />
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={contact.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={contact.lastName} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={contact.email} onChange={handleChange} />
        </div>
        <div>
          <label>Job Title:</label>
          <input type="text" name="jobTitle" value={contact.jobTitle} onChange={handleChange} />
        </div>
        <div>
          <label>Street:</label>
          <input type="text" name="street" value={contact.street} onChange={handleChange} />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={contact.city} onChange={handleChange} />
        </div>
        <div>
          <label>Gender:</label>
          <input type="text" name="gender" value={contact.gender} onChange={handleChange} />
        </div>
        <div>
          <label>Favourite Colour:</label>
          <input type="color" name="favouriteColour" value={contact.favouriteColour} onChange={handleChange} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Profile;