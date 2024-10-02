import React from 'react';
const UserAvatar = ({ size, name, avatarUrl, onImageRemove }) => {
    const avatarStyle = {
      borderRadius: '50%',
      width: size,
      height: size,
      objectFit: 'cover',
      position: 'relative', // Position relative for delete icon positioning
    };
 
    const deleteIconStyle = {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: '#ffffff',
      borderRadius: '50%',
      cursor: 'pointer',
      padding: '2px',
    };
 
    // Function to get initials from name
    const getInitials = (name) => {
      if (!name) return '';
 
      const parts = name.split(' ');
      if (parts.length === 1) {
        // If only one part, return the first two characters
        return name.substring(0, 2).toUpperCase();
      }
      // If two or more parts, return the first character of each part
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    };
 
    return (
      <div style={{ position: 'relative' }}>
        {avatarUrl ? (
          <div>
            <img
              src={avatarUrl}
              alt="User Avatar"
              style={avatarStyle}
            />
          </div>
        ) : (
          <div
            style={{
              ...avatarStyle,
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: `${size / 3}px`,
            }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
    );
  };
 
  export default UserAvatar;