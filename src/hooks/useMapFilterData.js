import { useTranslation } from 'react-i18next';

export const useMapFilterData = () => {
    const { t } = useTranslation();

    const locationsNames = 
   [
        {key:'0', value:t('cerca')},
        {key:'-', value:'Andorra', disabled:true},
        {key:'1', value:'Andorra Centro'},
        {key:'2', value:'Andorra Norte'},
        {key:'3', value:'Andorra Sud'},
        {key:'-', value:'Pirineo Catalán', disabled:true},
        {key:'4', value:'Aran'},
        {key:'5', value:'Cadi Moixeró'},
        {key:'6', value:'Franja Nord Pallaresa'},
        {key:'7', value:'Pallaresa'},
        {key:'8', value:'Perafita-Puigpedrós'},
        {key:'9', value:'Prepirineu'},
        {key:'10', value:'Ribagorçana-Vall fosca'},
        {key:'11', value:'Ter-Freser'},
        {key:'-', value:'Pirineo Aragonés', disabled:true},
        {key:'12', value:'Gallego'},
        {key:'13', value:'Jacetania'},
        {key:'14', value:'Navarra'},
        {key:'15', value:'Ribagorza'},
        {key:'16', value:'Sobarbe'},
        {key:'-', value:'Pirineo Francés', disabled:true},
        {key:'17', value:'Aure-Louron'},
        {key:'18', value:'Aspe Ossau'},
        {key:'19', value:'Capcir Puymorens'},
        {key:'20', value:'Cerdagne Canigou'},
        {key:'21', value:'Couserans'},
        {key:'22', value:'Haute-Ariege'},
        {key:'23', value:'Haute-Bigorre'},
        {key:'24', value:'Luchonnais'},
        {key:'25', value:'Orlu St.Barthelemy'},
        {key:'26', value:'Pays Basques'},
    ]
    const filterNames = 
        [
            {key:'0', value:`3 ${t('dias')}`},
            {key:'1', value:`7 ${t('dias')}`},
            {key:'2', value:`15 ${t('dias')}`},
            {key:'3', value:`30 ${t('dias')}`},
            {key:'4', value:`60 ${t('dias')}`},
        ]

    const filterData = [3,7,15,30,60];

    const locationsData = 
    [
        
        {},
        //Andorra centre
        {latitude: 42.53510694555712, longitude: 1.5529746979350716, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Andorra Nord
        {latitude: 42.58508140442987, longitude: 1.6121730217316999, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Andorra sud
        {latitude: 42.47643586986891, longitude: 1.5254365477795353, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Aran
        {latitude: 42.72567723176232, longitude: 0.8281045165341556, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Vessant Nord del Cadí - Moixeró
        {latitude: 42.310328696693205, longitude: 1.7425851209750538, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Franja Nord Pallaresa
        {latitude: 42.69102717939461, longitude: 1.1962633621105154, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Pallaresa
        {latitude: 42.52315563020173, longitude: 1.2052674661716754, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Perafita - Puigpedrós
        {latitude: 42.43414018231118, longitude: 1.7042078440086903, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        //Prepirineu
        {latitude: 42.2245394588584, longitude: 1.7061709869780184, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Ribagorçana - Vall Fosca
        {latitude: 42.50068289698385, longitude: 0.8847895009997644, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Ter - Freser
        {latitude: 42.34214000793094, longitude: 2.206219368664737, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Gállego
        {latitude: 42.69828823872771, longitude: -0.32086395579789756, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Jacetania
        {latitude: 42.73616245506156, longitude: -0.6700259161023963, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Navarra
        {latitude: 42.89790515462238, longitude: -0.8838023992059396, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Ribagorza
        {latitude: 42.490199948537196, longitude: 0.5463579234317549, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Sobrarbe
        {latitude: 42.589735813272995, longitude: 0.06135151529448856, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Aure-Louron
        {latitude: 42.81725925731871, longitude: 0.40036797174945615, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Aspe-Ossau
        {latitude: 42.95054425358967, longitude: -0.4938979162532413, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Capcir-Puymorens
        {latitude: 42.5745743526584, longitude: 2.0694767893058414, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Cerdagne-Canigou
        {latitude: 42.47697846271217, longitude: 2.3300773692087, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Couserans
        {latitude: 42.840606256268444, longitude: 1.0914929689276556, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Haute-Ariege
        {latitude: 42.70727142469974, longitude: 1.6272922471171227, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Haute-Bigorre
        {latitude: 42.884428486335054, longitude: 0.0290562066956063, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Luchonnais
        {latitude: 42.79009890768029, longitude: 0.5678202122096825, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Orlu St Barthelemy
        {latitude: 42.77647560690008, longitude: 1.8490136882170525, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
        // Pays Basque
        {latitude: 43.04467220887861, longitude: -0.9100899533724659, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    ]


   

    return { locationsData, filterNames, filterData, locationsNames};
};