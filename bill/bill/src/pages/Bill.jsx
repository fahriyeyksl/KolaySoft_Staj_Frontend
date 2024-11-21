import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import DownloadButton from "./dowloadbutton.jsx";
import "../assets/style/bill.css"
function Bill() {
    const navigate = useNavigate();

    const goToEditPage = () => {
        navigate('/edit'); // Edit sayfasına yönlendirme
    };

    const goToDownloadPage = () => {
        navigate('/download'); // Download sayfasına yönlendirme
    };

    return (
        <>
            <div>
                {/* Edit Butonu */}
                <Button animated='vertical' onClick={goToEditPage}>
                    <Button.Content hidden>Edit</Button.Content>
                    <Button.Content visible>
                        <Icon name='edit'/>
                    </Button.Content>
                </Button>
                <div style={{marginBottom: '10px'}}></div>
                <DownloadButton/>
            </div>
        </>
    );
}

export default Bill;
