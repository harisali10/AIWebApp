import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Divider, Button } from '@material-ui/core';
import { Circle, Spinner } from 'react-spinners-css';
import constants from '../utilities/constants';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Select, FormControl, InputLabel, MenuItem, FormHelperText, TextField, Drawer, Snackbar, Typography, Backdrop, CircularProgress } from '@material-ui/core';

const constant = constants.getConstant();

const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const fields = [
    {
        sourcetype: 'MySql', field: [
            { fieldName: 'Host*', id: 'host', type: 'text', validity: true, hints: 'The hostname of the database.' },
            { fieldName: 'Port*', id: 'port', type: 'text', validity: true, hints: 'The port to connect to.(e.g. 3306).' },
            { fieldName: 'Username*', id: 'username', type: 'text', validity: true, hints: 'The username which is used to access the database.' },
            { fieldName: 'Database*', id: 'database', type: 'text', validity: true, hints: 'The database name.' },
            { fieldName: 'Password', id: 'password', type: 'text', validity: true, hints: 'The password associated with the username.' },
            { fieldName: 'JDBC URL Params', id: 'jdbcurlparams', validity: true, type: 'text', hints: 'Additional properties to pass to the jdbc url string when connecting to the database formatted as keyvalue pairs separated by the symbol &. (example: key1=value1&key2=value2&key3=value3).' },
            { fieldName: 'SSL Connection', id: 'sslconnection', validity: true, type: 'toggle', hints: 'Encrypt data using SSL.' },
            {
                fieldName: 'Replication Method*',
                id: 'replicationmethod',
                type: 'dropdown',
                validity: true,
                hints: 'Replication method which is used for data extraction from the database. STANDARD replication requires no setup on the DB side but will not be able to represent deletions incrementally. CDC uses the Binlog to detect inserts, updates, and deletes. This needs to be configured on the source database itself.',
                dropdownlist: [
                    { name: 'Standard', code: 'Standard' },
                    { name: 'CDC', code: 'CDC' },
                ]
            },
            {
                fieldName: 'SSH Tunnel Method',
                id: 'sshtunnelmethod',
                type: 'dropdown',
                validity: true,
                hints: 'Whether to initiate an SSH tunnel before connecting to the database, and if so, which kind of authentication to use.',
                dropdownlist: [
                    { name: 'No tunnel', code: 'Notunnel' },
                    { name: 'SSH Key Authentication', code: 'SSHKeyAuthentication' },
                    { name: 'Password Authentication', code: 'PasswordAuthentication' },
                ]
            },
        ]
    },
    {
        sourcetype: 'QuickBooks', field: [
            { fieldName: 'Sanbox', id: 'sandbox', type: 'toggle', validity: true, hints: 'Determines whether to use the sandbox or production environment.' },
            { fieldName: 'Realm ID*', id: 'realmid', type: 'text', validity: true, hints: 'Labeled Company ID. The Make API Calls panel is populated with the realm id and the current access token.' },
            { fieldName: 'Client ID*', id: 'clientid', type: 'text', validity: true, hints: 'Identifies which app is making the request. Obtain this value from the Keys tab on the app profile via My Apps on the developer site. There are two versions of this key: development and production.' },
            { fieldName: 'Start Date*', id: 'startdatequickbook', type: 'date', validity: true, hints: 'The default value to use if no bookmark exists for an endpoint (rfc3339 date string). E.g, 2021-03-20T00:00:00Z. Any data before this date will not be replicated. (e.g. 2021-03-20T00:00:00Z)' },
            { fieldName: 'User Agent*', id: 'useragent', type: 'text', validity: true, hints: 'Process and email for API logging purposes. Example: tap-quickbooks.' },
            { fieldName: 'Client Secret*', id: 'clientsecret', type: 'text', validity: true, hints: 'Obtain this value from the Keys tab on the app profile via My Apps on the developer site. There are two versions of this key: development and production.' },
            { fieldName: 'Refresh Token*', id: 'refreshtoken', type: 'text', validity: true, hints: 'A token used when refreshing the access token.' },
        ]
    },
    {
        sourcetype: 'BigCommerce', field: [
            { fieldName: 'Start Date*', id: 'startdatebigcommerce', type: 'date', validity: true, hints: 'The date you would like to replicate data. Format: YYYY-MM-DD. (e.g. 2021-01-01)' },
            { fieldName: 'Store Hash*', id: 'storehash', type: 'text', validity: true, hints: "The hash code of the store. For https://api.bigcommerce.com/stores/HASH_CODE/v3/, The store's hash code is 'HASH_CODE'." },
            { fieldName: 'Access Token*', id: 'accesstoken', type: 'text', validity: true, hints: 'Access Token for making authenticated requests.' },
        ]
    },
    {
        sourcetype: 'MongoDB', field: [
            { fieldName: 'Database Name*', id: 'databaseName', type: 'text', validity: true, hints: ' The database you want to replicate.' },
            { fieldName: 'User*', id: 'user', type: 'text', validity: true, hints: 'The username which is used to access the database.' },
            { fieldName: 'Password*', id: 'password', type: 'text', validity: true, hints: 'The password associated with this username.' },
            { fieldName: 'Authentication Source', id: 'authenticationSource', type: 'text', validity: true, hints: 'The authentication source where the user information is stored. (e.g. admin)' },
            {
                fieldName: 'MongoDb Instance Type',
                id: 'mongoDBInstance',
                type: 'dropdown',
                validity: true,
                hints: 'The MongoDb instance to connect to. For MongoDB Atlas and Replica Set TLS connection is used by default.',
                dropdownlist: [
                    { name: 'Standalone MongoDB Instance', code: 'standaloneMongodbInstance' },
                    { name: 'Replica Set', code: 'replicaSet' },
                    { name: 'MongoDB Atlas', code: 'mongodbAtlas' },
                ]
            },
            { fieldName: 'Host*', id: 'host', type: 'text', validity: true, hints: ' The host name of the Mongo database.' },
            { fieldName: 'Port*', id: 'port', type: 'text', validity: true, hints: 'The port of the Mongo database. (e.g. 27017)' },
            { fieldName: 'TLS Connection*', id: 'tlsConnection', type: 'toggle', validity: true, hints: 'Indicates whether TLS encryption protocol will be used to connect to MongoDB. It is recommended to use TLS connection if possible.' }
        ]
    },
    {
        sourcetype: 'MSSQL', field: [
            { fieldName: 'Host*', id: 'host', type: 'text', validity: true, hints: 'The host name of the database.' },
            { fieldName: 'Port*', id: 'port', type: 'text', validity: true, hints: 'The port to connect to. (e.g. 1433)' },
            { fieldName: 'Databse*', id: 'database', type: 'text', validity: true, hints: 'The name of the database. (e.g. master)' },
            { fieldName: 'Username*', id: 'username', type: 'text', validity: true, hints: 'The username which is used to access the database.' },
            { fieldName: 'Password*', id: 'password', type: 'text', validity: true, hints: 'The password associated with the username.' },
            { fieldName: 'JDBC URL Params', id: 'jdbcurlparams', type: 'text', validity: true, hints: "Additional properties to pass to the jdbc url string when connecting to the database formatted as 'key=value' pairs separated by the symbol '&'. (example: key1=value1&key2=value2&key3=value3)." },
            { fieldName: 'SSL Connection', id: 'sslconnection', type: 'toggle', validity: true, hints: 'Encrypt data using SSL.' },
            {
                fieldName: 'Replication Method*',
                id: 'replicationmethod',
                type: 'dropdown',
                validity: true,
                hints: 'Replication method which is used for data extraction from the database. STANDARD replication requires no setup on the DB side but will not be able to represent deletions incrementally. CDC uses the Binlog to detect inserts, updates, and deletes. This needs to be configured on the source database itself.',
                dropdownlist: [
                    { name: 'Standard', code: 'Standard' },
                    { name: 'CDC', code: 'CDC' },
                ]
            },
            {
                fieldName: 'SSH Tunnel Method',
                id: 'sshtunnelmethodCertificate',
                type: 'dropdown',
                validity: true,
                hints: 'The encryption method which is used when communicating with the database.',
                dropdownlist: [
                    { name: 'Unencrypted', code: 'unencrypted' },
                    { name: 'Encrypted (trust server certificate)', code: 'encryptedTrustServerCertificate' },
                    { name: 'Encrypted (Verify certificate)', code: 'EncryptedVerifyCertificate' },
                ]
            },
            {
                fieldName: 'SSH Tunnel Method',
                id: 'sshtunnelmethod',
                type: 'dropdown',
                validity: true,
                hints: 'Whether to initiate an SSH tunnel before connecting to the database, and if so, which kind of authentication to use.',
                dropdownlist: [
                    { name: 'No tunnel', code: 'Notunnel' },
                    { name: 'SSH Key Authentication', code: 'SSHKeyAuthentication' },
                    { name: 'Password Authentication', code: 'PasswordAuthentication' },
                ]
            }
        ]
    },
]

const subFields = [
    {
        dropdowntype: 'SSHKeyAuthentication',
        field: [
            { fieldName: 'SSH Tunnel Jump Server Host', id: 'sshtnneljumpserverhostkeyauth', type: 'text', validity: true, hints: 'Hostname of the jump server host that allows inbound ssh tunnel.' },
            { fieldName: 'SSH Connection Port*', id: 'sshconnectionportkeyauth', type: 'text', validity: true, hints: 'Port on the proxy/jump server that accepts inbound ssh connections. (e.g. 22)' },
            { fieldName: 'SSH Login Username*', id: 'sshloginusernamekeyauth', type: 'text', validity: true, hints: 'OS-level username for logging into the jump server host.' },
            { fieldName: 'SSH Private Key*', id: 'sshprivatekeykeyauth', type: 'text', validity: true, hints: 'OS-level user account ssh key credentials in RSA PEM format ( created with ssh-keygen -t rsa -m PEM -f myuser_rsa )' },
        ]
    },
    {
        dropdowntype: 'PasswordAuthentication',
        field: [
            { fieldName: 'SSH Tunnel Jump Server Host', id: 'sshtnneljumpserverhostpassauth', type: 'text', validity: true, hints: 'Hostname of the jump server host that allows inbound ssh tunnel.' },
            { fieldName: 'SSH Connection Port*', id: 'sshconnectionportpassauth', type: 'text', validity: true, hints: 'Port on the proxy/jump server that accepts inbound ssh connections. (e.g. 22)' },
            { fieldName: 'SSH Login Username*', id: 'sshloginusernamepassauth', type: 'text', validity: true, hints: 'OS-level username for logging into the jump server host.' },
            { fieldName: 'Password*', id: 'sshpasswordpassauth', type: 'text', validity: true, hints: 'OS-level password for logging into the jump server host.' },
        ]
    },
    {
        dropdowntype: 'EncryptedVerifyCertificate',
        field: [
            { fieldName: 'Host Name In Certificate', id: 'hostNameinCertificate', type: 'text', validity: true, hints: 'Specifies the host name of the server. The value of this property must match the subject property of the certificate.' },
        ]
    }
]

const Setups = (props) => {
    const classes = useStyles();
    const sourceTypes = [
        { name: 'MySql', code: 'MySql' },
        { name: 'QuickBooks', code: 'QuickBooks' },
        { name: 'BigCommerce', code: 'BigCommerce' },
        { name: 'MongoDB', code: 'MongoDB' },
        { name: 'MSSQL', code: 'MSSQL' }
    ];
    const toast = React.useRef(null);
    const [newData, setNewData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [setupInitials, setSetupInitials] = useState({
        SetupName: '',
        SourceType: null,
        SetupNameValidity: true,
        SourceTypeValidity: true
    });
    const [setupsourceConfiguration, setSetupSourceConfiguration] = useState({
        MySql: {
            host: '',
            port: '',
            username: '',
            database: '',
            password: '',
            jdbcurlparams: '',
            sslconnection: false,
            replicationmethod: null,
            sshtunnelmethod: null,
            SSHKeyAuthentication: {
                sshtnneljumpserverhostkeyauth: '',
                sshconnectionportkeyauth: '',
                sshloginusernamekeyauth: '',
                sshprivatekeykeyauth: ''
            },
            PasswordAuthentication: {
                sshtnneljumpserverhostpassauth: '',
                sshconnectionportpassauth: '',
                sshloginusernamepassauth: '',
                sshpasswordpassauth: ''
            }
        },
        BigCommerce: {
            startdatebigcommerce: new Date(),
            storehash: '',
            accesstoken: ''
        },
        QuickBooks: {
            sandbox: false,
            realmid: '',
            clientid: '',
            startdatequickbook: new Date(),
            useragent: '',
            clientsecret: '',
            refreshtoken: ''
        },
        MongoDB: {
            databaseName: '',
            user: '',
            password: '',
            authenticationSource: '',
            mongoDBInstance: null,
            host: '',
            port: '',
            tlsConnection: false
        },
        MSSQL: {
            host: '',
            port: '',
            username: '',
            database: '',
            password: '',
            jdbcurlparams: '',
            sslconnection: false,
            replicationmethod: null,
            sshtunnelmethodCertificate: null,
            sshtunnelmethod: null,
            SSHKeyAuthentication: {
                sshtnneljumpserverhostkeyauth: '',
                sshconnectionportkeyauth: '',
                sshloginusernamekeyauth: '',
                sshprivatekeykeyauth: ''
            },
            PasswordAuthentication: {
                sshtnneljumpserverhostpassauth: '',
                sshconnectionportpassauth: '',
                sshloginusernamepassauth: '',
                sshpasswordpassauth: ''
            },
            EncryptedVerifyCertificate: {
                hostNameinCertificate: ''
            }
        }
    });

    useEffect(() => {
        setLoading(true);
        axios.post(`${constant.url}GetStockSetupSource`, { Header: { ShopURL: localStorage.getItem("shop") } })
            .then(function (response) {
                if (response.data.Success === true) {
                    if (response.data.Message !== null) {
                        setNewData(false);
                        setLoading(false);
                        let data = response.data.Message;
                        setSetupInitials((prev) => ({ ...prev, SetupName: data.SetupName, SourceType: { name: data.SourceType, code: data.SourceType }, SetupNameValidity: true, SourceTypeValidity: true }))
                        let configuationdata = JSON.parse(data.SourceConfiguration);
                        let keys = Object.keys(configuationdata).filter((item) => item.includes("date") === true);

                        for (let i in configuationdata) {
                            for (let j = 0; j < keys.length; j++) {
                                if (i === keys[j]) {
                                    let date = new Date(configuationdata[i]);
                                    configuationdata[i] = date;
                                }
                            }
                        }
                        setSetupSourceConfiguration((prev) => ({ ...prev, [data.SourceType]: configuationdata }));
                    }
                    else {
                        setLoading(false);
                        setNewData(true);
                        toast.current.show({ severity: 'info', summary: 'No Source Setup found!', detail: "Please Create Source Setup to show records.", life: 3000 });
                    }
                }
                else {
                    setLoading(false);
                    toast.current.show({ severity: 'error', summary: 'Error Message', detail: response.data.Message, life: 3000 });
                }
            })
            .catch(function (error) {
                setLoading(false);
                toast.current.show({ severity: 'error', summary: 'Error Message', detail: error.message === undefined || null ? "StockSources Not Found" : null, life: 3000 });
            });
    }, []);

    const renderSubfieldsformysqlsshtunnelmethod = () => {
        let filtereditem;
        let newfields;
        if (setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod !== null) {
            if (setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code === "SSHKeyAuthentication") {
                filtereditem = subFields.filter((item) => item.dropdowntype === setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code);
                newfields = filtereditem[0].field.map((item, index) => {
                    return (
                        <div key={index} className="p-col-12">
                            <div className="p-field">
                                <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                {
                                    item.type === 'text' &&
                                    <>
                                        <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigsDropdown(setupInitials.SourceType.code, setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                        {item.validity === false &&
                                            <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    )
                })
                return newfields;
            }
            if (setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code === "PasswordAuthentication") {
                filtereditem = subFields.filter((item) => item.dropdowntype === setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code);
                newfields = filtereditem[0].field.map((item, index) => {
                    return (
                        <div key={index} className="p-col-12">
                            <div className="p-field">
                                <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                {
                                    item.type === 'text' &&
                                    <>
                                        <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][setupsourceConfiguration[setupInitials.SourceType.code].sshtunnelmethod.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigsDropdown(setupInitials.SourceType.code, setupsourceConfiguration.MySql.sshtunnelmethod.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                        {item.validity === false &&
                                            <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    )
                })
                return newfields;
            }
            else {
                return null;
            }
        }
        else if (setupsourceConfiguration.MSSQL.sshtunnelmethodCertificate !== null) {
            if (setupsourceConfiguration.MSSQL.sshtunnelmethodCertificate.code === "EncryptedVerifyCertificate") {
                filtereditem = subFields.filter((item) => item.dropdowntype === setupsourceConfiguration.MSSQL.sshtunnelmethodCertificate.code);
                newfields = filtereditem[0].field.map((item, index) => {
                    return (
                        <div key={index} className="p-col-12">
                            <div className="p-field">
                                <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                {
                                    item.type === 'text' &&
                                    <>
                                        <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][setupsourceConfiguration.MSSQL.sshtunnelmethodCertificate.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigsDropdown(setupInitials.SourceType.code, setupsourceConfiguration.MSSQL.sshtunnelmethodCertificate.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                        {item.validity === false &&
                                            <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    )
                })
                return newfields;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    const renderFields = () => {
        let filterditem;
        let newfields;
        if (setupInitials.SourceType !== null) {
            switch (setupInitials.SourceType.code) {
                case "MySql":
                    filterditem = fields.filter((item) => item.sourcetype === setupInitials.SourceType.code);
                    newfields = filterditem[0].field.map((item, index) => {
                        return (
                            <div key={index} className="p-col-12">
                                <div className="p-field">
                                    <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                    {
                                        item.type === 'text' &&
                                        <>
                                            <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'dropdown' &&
                                        <>
                                            <Dropdown id={item.id} style={{ width: '100%' }} value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} options={item.dropdownlist} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value); }} optionLabel="name" placeholder={`Select ${item.fieldName}`} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid` : ``} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'toggle' &&
                                        <InputSwitch id={item.id} checked={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value)} />
                                    }
                                </div>
                            </div>
                        )
                    })
                    return newfields;
                case "QuickBooks":
                    filterditem = fields.filter((item) => item.sourcetype === setupInitials.SourceType.code);
                    newfields = filterditem[0].field.map((item, index) => {
                        return (
                            <div key={index} className="p-col-12">
                                <div className="p-field">
                                    <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                    {
                                        item.type === 'text' &&
                                        <>
                                            <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'date' &&
                                        <>
                                            <Calendar dateFormat="dd/mm/yy" value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid` : ``} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'toggle' &&
                                        <InputSwitch id={item.id} checked={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value)} />
                                    }
                                </div>
                            </div>
                        )
                    })
                    return newfields;
                case "BigCommerce":
                    filterditem = fields.filter((item) => item.sourcetype === setupInitials.SourceType.code);
                    newfields = filterditem[0].field.map((item, index) => {
                        return (
                            <div key={index} className="p-col-12">
                                <div className="p-field">
                                    <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                    {
                                        item.type === 'text' &&
                                        <>
                                            <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'date' &&
                                        <>
                                            <Calendar dateFormat="dd/mm/yy" value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid` : ``} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        )
                    })
                    return newfields;
                case "MongoDB":
                    filterditem = fields.filter((item) => item.sourcetype === setupInitials.SourceType.code);
                    newfields = filterditem[0].field.map((item, index) => {
                        return (
                            <div key={index} className="p-col-12">
                                <div className="p-field">
                                    <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                    {
                                        item.type === 'text' &&
                                        <>
                                            <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'dropdown' &&
                                        <>
                                            <Dropdown id={item.id} style={{ width: '100%' }} value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} options={item.dropdownlist} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value); }} optionLabel="name" placeholder={`Select ${item.fieldName}`} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid` : ``} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'toggle' &&
                                        <InputSwitch id={item.id} checked={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value)} />
                                    }
                                </div>
                            </div>
                        )
                    })
                    return newfields;
                case "MSSQL":
                    filterditem = fields.filter((item) => item.sourcetype === setupInitials.SourceType.code);
                    newfields = filterditem[0].field.map((item, index) => {
                        return (
                            <div key={index} className="p-col-12">
                                <div className="p-field">
                                    <label htmlFor={item.id} className="p-d-block"><span style={{ fontWeight: 'bold' }}>{item.fieldName}{item.hints !== "" ? " - " : " "}</span>{item.hints}</label>
                                    {
                                        item.type === 'text' &&
                                        <>
                                            <InputText value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.target.value); }} id={item.id} style={{ width: '100%' }} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'dropdown' &&
                                        <>
                                            <Dropdown id={item.id} style={{ width: '100%' }} value={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} options={item.dropdownlist} onChange={(e) => { item.validity = true; onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value); }} optionLabel="name" placeholder={`Select ${item.fieldName}`} aria-describedby={`${item.id}-help`} className={item.validity === false ? `p-invalid` : ``} />
                                            {item.validity === false &&
                                                <small id={`${item.id}-help`} className="p-error p-d-block">{item.fieldName} is not available.</small>
                                            }
                                        </>
                                    }
                                    {
                                        item.type === 'toggle' &&
                                        <InputSwitch id={item.id} checked={setupsourceConfiguration[setupInitials.SourceType.code][item.id]} onChange={(e) => onChangeforConfigs(setupInitials.SourceType.code, item.id, e.value)} />
                                    }
                                </div>
                            </div>
                        )
                    })
                    return newfields;
                default:
                    return null;
            }
        }
        else {
            return null
        }
    }

    const onChangeforConfigsDropdown = (sourcetype, dropdown, name, value) => {
        let obj = setupsourceConfiguration[sourcetype];
        let newObj = obj[dropdown];
        newObj = { ...newObj, [name]: value }
        obj = { ...obj, [dropdown]: newObj };
        setSetupSourceConfiguration((prev) => ({ ...prev, [sourcetype]: obj }));
    }

    const onChangeforConfigs = (sourcetype, name, value) => {
        let obj = setupsourceConfiguration[sourcetype];
        obj = { ...obj, [name]: value };
        setSetupSourceConfiguration((prev) => ({ ...prev, [sourcetype]: obj }));
    }

    const createStockSetup = () => {
        console.log({ haris: setupInitials })
        if (setupInitials.SourceType !== null) {
            let Configuration = setupsourceConfiguration[setupInitials.SourceType.code];
            // if (setupInitials.SourceType.code === "MySql") {
            //     if (Configuration.sshtunnelmethod !== null) {
            //         if (Configuration.sshtunnelmethod.code === "SSHKeyAuthentication") {
            //             delete Configuration["PasswordAuthentication"];
            //         }
            //         else if (Configuration.sshtunnelmethod.code === "PasswordAuthentication") {
            //             delete Configuration["SSHKeyAuthentication"];
            //         }
            //         else {
            //             delete Configuration["SSHKeyAuthentication"];
            //             delete Configuration["PasswordAuthentication"];
            //         }
            //     }
            // }

            if (checkFields(Configuration)) {
                let Header = {
                    SetupName: setupInitials.SetupName,
                    SourceType: setupInitials.SourceType.code,
                    SourceConfiguration: Configuration,
                    ClientID: 21,
                    ShopURL: localStorage.getItem("shop"),
                    Type: 'CreateSetupSource'
                }

                if (newData === true) {
                    axios.post(`${constant.url}CreateStockSetupSource`, { Header })
                        .then(function (response) {
                            if (response.data.Success === true) {
                                toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Setup Source Created!', life: 3000 });
                                setNewData(false);
                                clearPage();
                            }
                            else {
                                toast.current.show({ severity: 'error', summary: 'Error Message', detail: response.data.Message, life: 3000 });
                            }
                        })
                        .catch(function (error) {
                            // toast.current.show({ severity: 'error', summary: 'Error Message', detail: error.message, life: 3000 });
                        });
                }
                else {
                    axios.post(`${constant.url}UpdateStockSetupSource`, { Header })
                        .then(function (response) {
                            if (response.data.Success === true) {
                                toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Setup Source Updated!', life: 3000 });
                                // clearPage();
                            }
                            else {
                                toast.current.show({ severity: 'error', summary: 'Error Message', detail: response.data.Message, life: 3000 });
                            }
                        })
                        .catch(function (error) {
                            toast.current.show({ severity: 'error', summary: 'Error Message', detail: error.message, life: 3000 });
                        });
                }

            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Input Fields', life: 3000 });
            }
        }
        else {
            if (checkHeaderfields() === false) {
                toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Input Fields', life: 3000 });
            }
        }
    }

    const checkFields = (configObj) => {
        if (checkHeaderfields()) {
            let checked = true;
            let obj = configObj;
            let listField = fields.filter((item) => item.sourcetype === setupInitials.SourceType.code);
            listField = listField[0].field;
            
            for (let i = 0; i < listField.length; i++) {
                if (obj[listField[i].id] === "" || obj[listField[i].id] === undefined || obj[listField[i].id] === null) {
                    listField[i].validity = false;
                    checked = false;
                }
            }

            if (setupInitials.SourceType.code === "MySql") {
                if (setupsourceConfiguration.MySql.sshtunnelmethod !== null) {
                    let subObj = obj[setupsourceConfiguration.MySql.sshtunnelmethod.code];
                    let subdropdownFields = subFields.filter((item) => item.dropdowntype === setupsourceConfiguration.MySql.sshtunnelmethod.code);
                    if(subdropdownFields.length>0){
                        subdropdownFields = subdropdownFields[0].field;
                        for (let i = 0; i < subdropdownFields.length; i++) {
                            if (subObj[subdropdownFields[i].id] === "" || subObj[subdropdownFields[i].id] === undefined || subObj[subdropdownFields[i].id] === null) {
                                subdropdownFields[i].validity = false;
                                checked = false;
                            }
                        }
                    }
                }
            }

            if (setupInitials.SourceType.code === "MSSQL") {
                if (setupsourceConfiguration.MSSQL.sshtunnelmethod !== null) {
                    let subObj = obj[setupsourceConfiguration.MSSQL.sshtunnelmethod.code];
                    let subdropdownFields = subFields.filter((item) => item.dropdowntype === setupsourceConfiguration.MSSQL.sshtunnelmethod.code);
                    if (subdropdownFields.length > 0) {
                        subdropdownFields = subdropdownFields[0].field;
                        for (let i = 0; i < subdropdownFields.length; i++) {
                            if (subObj[subdropdownFields[i].id] === "" || subObj[subdropdownFields[i].id] === undefined || subObj[subdropdownFields[i].id] === null) {
                                subdropdownFields[i].validity = false;
                                checked = false;
                            }
                        }
                    }
                }
            }

            obj = { ...obj };
            setSetupSourceConfiguration((prev) => ({ ...prev, [setupInitials.SourceType.code]: obj }));
            return checked;
        }
        else {
            return false;
        }
    }

    const checkHeaderfields = () => {
        let checked = true;
        if (setupInitials.SetupName === "" || setupInitials.SetupName === null || setupInitials.SetupName === undefined) {
            checked = false;
            setSetupInitials((prev) => ({ ...prev, SetupNameValidity: false }));
        }

        if (setupInitials.SourceType === null || setupInitials.SourceType === undefined) {
            checked = false;
            setSetupInitials((prev) => ({ ...prev, SourceTypeValidity: false }));
        }
        return checked;
    }

    const clearPage = () => {
        setSetupSourceConfiguration({
            MySql: {
                host: '',
                port: '',
                username: '',
                database: '',
                password: '',
                jdbcurlparams: '',
                sslconnection: '',
                replicationmethod: null,
                sshtunnelmethod: null,
                SSHKeyAuthentication: {
                    sshtnneljumpserverhostkeyauth: '',
                    sshconnectionportkeyauth: '',
                    sshloginusernamekeyauth: '',
                    sshprivatekeykeyauth: ''
                },
                PasswordAuthentication: {
                    sshtnneljumpserverhostpassauth: '',
                    sshconnectionportpassauth: '',
                    sshloginusernamepassauth: '',
                    sshpasswordpassauth: ''
                }
            },
            BigCommerce: {
                startdatebigcommerce: new Date(),
                storehash: '',
                accesstoken: ''
            },
            QuickBooks: {
                sandbox: false,
                realmid: '',
                clientid: '',
                startdatequickbook: new Date(),
                useragent: '',
                clientsecret: '',
                refreshtoken: ''
            },
            MongoDB: {
                databaseName: '',
                user: '',
                password: '',
                authenticationSource: '',
                mongoDBInstance: null,
                host: '',
                port: '',
                tlsConnection: ''
            },
            MSSQL: {
                host: '',
                port: '',
                username: '',
                database: '',
                password: '',
                jdbcurlparams: '',
                sslconnection: '',
                replicationmethod: null,
                sshtunnelmethodCertificate: null,
                sshtunnelmethod: null,
                SSHKeyAuthentication: {
                    sshtnneljumpserverhostkeyauth: '',
                    sshconnectionportkeyauth: '',
                    sshloginusernamekeyauth: '',
                    sshprivatekeykeyauth: ''
                },
                PasswordAuthentication: {
                    sshtnneljumpserverhostpassauth: '',
                    sshconnectionportpassauth: '',
                    sshloginusernamepassauth: '',
                    sshpasswordpassauth: ''
                },
                EncryptedVerifyCertificate: {
                    hostNameinCertificate: ''
                }
            }
        })

        setSetupInitials({
            SetupName: '',
            SourceType: null,
            SetupNameValidity: true,
            SourceTypeValidity: true
        });

        for (let i = 0; i < fields.length; i++) {
            let listFields = fields[i].field;
            for (let j = 0; j < listFields.length; j++) {
                listFields[i].validity = true;
            }
        }

        for (let i = 0; i < subFields.length; i++) {
            let listsubFields = subFields[i].field;
            for (let j = 0; j < listsubFields.length; j++) {
                listsubFields[i].validity = true;
            }
        }
    }


    return (
        <div style={{ marginLeft: 32, marginTop: 30 }}>
            <div>
                {/* <h3 style={{ alignContent: 'center' }}>Setup</h3> */}
            </div>
            <Toast ref={toast} />
            {
                loading === true ?
                    <Backdrop className={classes.backdrop} open={loading} onClick={() => null}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    // <div style={{ position: 'fixed', top: '50%', bottom: '50%', left: '50%', right: '50%', zIndex: 5000, }}>
                    //     <Spinner />
                    // </div>
                    :
                    <div className="p-grid">
                        <div className="p-col-10 p-md-10 p-lg-8 p-offset-1 p-md-offset-1 p-lg-offset-2">
                            <Card title="Set up the Source">
                                <Divider light style={{ marginBottom: 20 }} />
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-12 p-lg-12">
                                        <div className="p-field">
                                            <label htmlFor="name" className="p-d-block"><span style={{ fontWeight: 'bold' }}>Name* - </span>Pick a name to help us identify this source.</label>
                                            <InputText value={setupInitials.SetupName} onChange={(e) => setSetupInitials((prev) => ({ ...prev, SetupName: e.target.value, SetupNameValidity: true }))} id="name" style={{ width: '100%' }} aria-describedby="name-help" className={setupInitials.SetupNameValidity === false ? `p-invalid p-d-block` : `p-d-block`} />
                                            {setupInitials.SetupNameValidity === false &&
                                                <small id="name-help" className="p-error p-d-block">Name* is not available.</small>
                                            }
                                        </div>
                                    </div>
                                    <div className="p-col-12 p-md-12 p-lg-12">
                                        <div className="p-field">
                                            <label htmlFor="sourcetype" className="p-d-block"><span style={{ fontWeight: 'bold' }}>Source type</span></label>
                                            <Dropdown id="sourcetype" style={{ width: '100%' }} value={setupInitials.SourceType} options={sourceTypes} onChange={(e) => setSetupInitials((prev) => ({ ...prev, SourceType: e.value, SourceTypeValidity: true }))} optionLabel="name" placeholder="Select a Source type" aria-describedby="sourcetype-help" className={setupInitials.SourceTypeValidity === false ? `p-invalid` : ``} />
                                            {setupInitials.SourceTypeValidity === false &&
                                                <small id="sourcetype-help" className="p-error p-d-block">Source type is not available.</small>
                                            }
                                        </div>
                                    </div>
                                    {renderFields()}
                                    {
                                        setupInitials.SourceType !== null &&
                                        (setupInitials.SourceType.code === "MySql" || setupInitials.SourceType.code === "MSSQL") === true &&
                                        renderSubfieldsformysqlsshtunnelmethod()
                                    }
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-3 p-md-3 p-lg-3">
                                        {/* <div className='p-col-12 p-md-1' style={{ marginLeft: 42 }}> */}
                                        <Button onClick={createStockSetup} style={{ width: 200 }} variant="contained" color="primary">Set up source</Button>
                                        {/* </div> */}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
            }
        </div>
    )
}
export default Setups;
