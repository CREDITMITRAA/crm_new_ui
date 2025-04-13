function EditIcon({onClick}) {
    return (
      <div className="w-5 h-5 cursor-pointer" onClick={onClick}> 
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.16"
            d="M4.16536 13.3333L3.33203 16.6667L6.66536 15.8333L14.9987 7.5L12.4987 5L4.16536 13.3333Z"
            fill="#777777"
          />
          <path
            d="M12.4987 4.9991L14.9987 7.4991M10.832 16.6658H17.4987M4.16536 13.3324L3.33203 16.6658L6.66536 15.8324L16.3204 6.17743C16.6328 5.86488 16.8083 5.44104 16.8083 4.9991C16.8083 4.55716 16.6328 4.13331 16.3204 3.82076L16.177 3.67743C15.8645 3.36498 15.4406 3.18945 14.9987 3.18945C14.5568 3.18945 14.1329 3.36498 13.8204 3.67743L4.16536 13.3324Z"
            stroke="#777777"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  
  export default EditIcon;
  