import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header({username}) {
  const [initials, setInitials] = useState('');
  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    // Fetch the contact data for the contact with ID 1
    const fetchContact = async () => {
      try {
        const response = await fetch('https://boolean-uk-api-server.fly.dev/${username}/contact/1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Extract the initials from the contact's first and last name
        const firstNameInitial = data.firstName.charAt(0).toUpperCase();
        const lastNameInitial = data.lastName.charAt(0).toUpperCase();
        setInitials(`${firstNameInitial}${lastNameInitial}`);
        setContactId(data.id); // Set the contact ID
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    fetchContact();
  }, []);

  return (
    <header>
      <div className="header-left">
        <img src="src/assets/title-header.svg" alt="Cohort Manager" />
      </div>
      <div className="header-right">
        {contactId && (
          <Link to={`/profile/${contactId}`} className="profile-link">
            {initials}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;