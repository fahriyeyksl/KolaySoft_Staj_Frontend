import React from 'react';
import axios from 'axios';
import { Button, Icon } from 'semantic-ui-react';

const DownloadButton = () => {
   const downloadXML = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/filecontroller/dowloadXslt', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoice.html';
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('XML indirme sırasında bir hata oluştu:', error);
        }
    };
    const dowloadXslt = async () =>{
        try {
            const response =await  axios.get("http://localhost:8080/api/filecontroller/dowloadXslt", {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'invoice.xslt';
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('XSLT indirme sırasında bir hata oluştu:', error);
        }
    }


    return (
        <div>
            <Button animated='vertical' onClick={downloadXML}>
                <Button.Content hidden>PDF</Button.Content>
                <Button.Content visible>
                    <Icon name='file pdf' />
                </Button.Content>
            </Button>
            <Button animated='vertical' onClick={dowloadXslt}>
                <Button.Content hidden>XSLT</Button.Content>
                <Button.Content visible>
                    <Icon name='download' />
                </Button.Content>
            </Button>
        </div>
    );
};

export default DownloadButton;
