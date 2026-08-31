import { COUNTRIES, CountryOption, getDialCodeForCountry } from './countries';

export interface StateDistrictMap {
  [stateName: string]: string[];
}

export interface CountryLocationData {
  states: string[];
  districts?: StateDistrictMap;
}

// Rich data for countries with administrative divisions and sub-districts
export const COUNTRY_LOCATIONS: Record<string, CountryLocationData> = {
  'United States': {
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico'
    ],
    districts: {
      California: ['Los Angeles County', 'San Diego County', 'Orange County', 'Riverside County', 'San Bernardino County', 'Santa Clara County', 'Alameda County', 'Sacramento County', 'Contra Costa County', 'Fresno County', 'San Francisco County', 'San Mateo County', 'Ventura County', 'San Joaquin County', 'Sonoma County', 'Stanislaus County', 'Solano County', 'Santa Barbara County', 'Monterey County', 'Placer County'],
      Texas: ['Harris County (Houston)', 'Dallas County', 'Tarrant County (Fort Worth)', 'Bexar County (San Antonio)', 'Travis County (Austin)', 'Collin County', 'Denton County', 'El Paso County', 'Fort Bend County', 'Hidalgo County', 'Montgomery County', 'Williamson County', 'Cameron County', 'Nueces County', 'Brazoria County'],
      'New York': ['New York County (Manhattan)', 'Kings County (Brooklyn)', 'Queens County', 'Bronx County', 'Richmond County (Staten Island)', 'Nassau County', 'Suffolk County', 'Westchester County', 'Erie County (Buffalo)', 'Monroe County (Rochester)', 'Onondaga County (Syracuse)', 'Albany County', 'Orange County', 'Rockland County', 'Dutchess County'],
      Florida: ['Miami-Dade County', 'Broward County (Fort Lauderdale)', 'Palm Beach County', 'Hillsborough County (Tampa)', 'Orange County (Orlando)', 'Pinellas County (St. Petersburg)', 'Duval County (Jacksonville)', 'Lee County (Fort Myers)', 'Polk County', 'Brevard County', 'Volusia County', 'Pasco County', 'Seminole County', 'Sarasota County', 'Manatee County'],
      Illinois: ['Cook County (Chicago)', 'DuPage County', 'Lake County', 'Will County', 'Kane County', 'McHenry County', 'Winnebago County (Rockford)', 'Madison County', 'St. Clair County', 'Champaign County', 'Sangamon County (Springfield)', 'Peoria County'],
      Pennsylvania: ['Philadelphia County', 'Allegheny County (Pittsburgh)', 'Montgomery County', 'Bucks County', 'Delaware County', 'Lancaster County', 'Chester County', 'York County', 'Berks County', 'Lehigh County', 'Northampton County', 'Erie County', 'Luzerne County', 'Dauphin County (Harrisburg)'],
      Washington: ['King County (Seattle)', 'Pierce County (Tacoma)', 'Snohomish County (Everett)', 'Spokane County', 'Clark County (Vancouver)', 'Thurston County (Olympia)', 'Kitsap County', 'Yakima County', 'Whatcom County (Bellingham)', 'Benton County'],
      Massachusetts: ['Suffolk County (Boston)', 'Middlesex County (Cambridge/Lowell)', 'Essex County', 'Worcester County', 'Norfolk County', 'Plymouth County', 'Bristol County', 'Hampden County (Springfield)', 'Barnstable County (Cape Cod)', 'Hampshire County'],
      Georgia: ['Fulton County (Atlanta)', 'Gwinnett County', 'Cobb County', 'DeKalb County', 'Chatham County (Savannah)', 'Clayton County', 'Cherokee County', 'Forsyth County', 'Henry County', 'Richmond County (Augusta)', 'Muscogee County (Columbus)'],
      'North Carolina': ['Mecklenburg County (Charlotte)', 'Wake County (Raleigh)', 'Guilford County (Greensboro)', 'Forsyth County (Winston-Salem)', 'Cumberland County (Fayetteville)', 'Durham County', 'Buncombe County (Asheville)', 'Union County', 'New Hanover County (Wilmington)', 'Gaston County'],
      Ohio: ['Franklin County (Columbus)', 'Cuyahoga County (Cleveland)', 'Hamilton County (Cincinnati)', 'Summit County (Akron)', 'Montgomery County (Dayton)', 'Lucas County (Toledo)', 'Butler County', 'Stark County (Canton)', 'Lorain County', 'Warren County'],
      Michigan: ['Wayne County (Detroit)', 'Oakland County', 'Macomb County', 'Kent County (Grand Rapids)', 'Genesee County (Flint)', 'Washtenaw County (Ann Arbor)', 'Ingham County (Lansing)', 'Ottawa County', 'Kalamazoo County', 'Saginaw County'],
      'New Jersey': ['Bergen County', 'Middlesex County', 'Essex County (Newark)', 'Hudson County (Jersey City)', 'Monmouth County', 'Ocean County', 'Union County', 'Camden County', 'Passaic County', 'Morris County', 'Burlington County', 'Mercer County (Trenton)'],
      Virginia: ['Fairfax County', 'Prince William County', 'Virginia Beach City', 'Loudoun County', 'Chesterfield County', 'Henrico County', 'Norfolk City', 'Chesapeake City', 'Arlington County', 'Richmond City', 'Newport News City', 'Alexandria City'],
      Arizona: ['Maricopa County (Phoenix)', 'Pima County (Tucson)', 'Pinal County', 'Yavapai County (Prescott)', 'Yuma County', 'Mohave County', 'Coconino County (Flagstaff)', 'Cochise County'],
      Colorado: ['Denver County', 'El Paso County (Colorado Springs)', 'Arapahoe County (Aurora)', 'Jefferson County', 'Adams County', 'Larimer County (Fort Collins)', 'Boulder County', 'Douglas County', 'Weld County (Greeley)'],
      'District of Columbia': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8'],
      'Puerto Rico': ['San Juan', 'Bayamón', 'Carolina', 'Ponce', 'Caguas', 'Guaynabo', 'Mayagüez', 'Arecibo', 'Toa Baja', 'Trujillo Alto'],
    },
  },

  'India': {
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
      'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
      'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
      'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    districts: {
      Maharashtra: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Satara', 'Jalgaon', 'Ahmednagar', 'Raigad', 'Ratnagiri', 'Akola', 'Latur', 'Dhule', 'Palghar', 'Chandrapur', 'Bhandara', 'Parbhani'],
      Karnataka: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Belagavi', 'Dakshina Kannada (Mangaluru)', 'Dharwad (Hubballi)', 'Tumakuru', 'Kalaburagi', 'Ballari', 'Shivamogga', 'Udupi', 'Hassan', 'Davangere', 'Vijayapura', 'Bagalkote', 'Chitradurga', 'Mandya', 'Kolar', 'Chikkamagaluru', 'Raichur', 'Bidar'],
      'Delhi (NCT)': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Kanchipuram', 'Chengalpattu', 'Thanjavur', 'Dindigul', 'Cuddalore', 'Kanyakumari', 'Virudhunagar', 'Thoothukudi', 'Karur', 'Namakkal', 'Krishnagiri', 'Tiruvallur'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Jhansi', 'Ayodhya', 'Mathura', 'Muzaffarnagar', 'Firozabad', 'Shahjahanpur', 'Budaun', 'Bulandshahr'],
      'West Bengal': ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Paschim Medinipur', 'Purba Medinipur', 'Darjeeling', 'Jalpaiguri', 'Murshidabad', 'Nadia', 'Purba Bardhaman', 'Paschim Bardhaman', 'Malda', 'Birbhum', 'Bankura', 'Purulia', 'Cooch Behar', 'Uttar Dinajpur', 'Dakshin Dinajpur', 'Alipurduar', 'Kalimpong', 'Jhargram'],
      Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Kutch', 'Navsari', 'Morbi', 'Mehsana', 'Bharuch', 'Valsad', 'Patan', 'Panchmahal', 'Banaskantha', 'Amreli', 'Sabarkantha'],
      Telangana: ['Hyderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal Urban (Hanamkonda)', 'Sangareddy', 'Nizamabad', 'Karimnagar', 'Khammam', 'Nalgonda', 'Mahabubnagar', 'Siddipet', 'Bhadradri Kothagudem', 'Jagtial', 'Mancherial', 'Kamareddy'],
      Kerala: ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam', 'Malappuram', 'Palakkad', 'Kannur', 'Alappuzha', 'Kottayam', 'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad'],
      'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore', 'Kakinada', 'Anantapur', 'Kadapa', 'Eluru', 'Srikakulam', 'Vizianagaram', 'Prakasam', 'Chittoor'],
      Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara', 'Sikar', 'Bharatpur', 'Pali', 'Ganganagar', 'Barmer', 'Chittorgarh', 'Jhunjhunu'],
      Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'SAS Nagar (Mohali)', 'Bathinda', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur', 'Kapurtala', 'Sangrur'],
      Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Sonipat', 'Panchkula', 'Rohtak', 'Yamunanagar', 'Kurukshetra', 'Rewari', 'Bhiwani', 'Sirsa'],
      Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Samastipur', 'Saharsa'],
      'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Singrauli', 'Katni'],
      Odisha: ['Khordha (Bhubaneswar)', 'Cuttack', 'Ganjam', 'Sundargarh (Rourkela)', 'Puri', 'Balasore', 'Sambalpur', 'Bhadrak', 'Mayurbhanj', 'Jajpur', 'Angul'],
    },
  },

  'United Kingdom': {
    states: [
      'England - Greater London', 'England - South East', 'England - North West', 'England - East of England',
      'England - West Midlands', 'England - South West', 'England - Yorkshire and the Humber', 'England - East Midlands',
      'England - North East', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    districts: {
      'England - Greater London': ['City of London', 'Camden', 'Greenwich', 'Hackney', 'Hammersmith and Fulham', 'Islington', 'Kensington and Chelsea', 'Lambeth', 'Lewisham', 'Southwark', 'Tower Hamlets', 'Wandsworth', 'Westminster', 'Barnet', 'Bexley', 'Brent', 'Bromley', 'Croydon', 'Ealing', 'Enfield', 'Haringey', 'Harrow', 'Havering', 'Hillingdon', 'Hounslow', 'Kingston upon Thames', 'Merton', 'Newham', 'Redbridge', 'Richmond upon Thames', 'Sutton', 'Waltham Forest'],
      'England - South East': ['Brighton and Hove', 'Buckinghamshire', 'East Sussex', 'Hampshire (Southampton/Portsmouth)', 'Isle of Wight', 'Kent', 'Medway', 'Milton Keynes', 'Oxfordshire (Oxford)', 'Reading', 'Slough', 'Surrey', 'West Berkshire', 'West Sussex', 'Windsor and Maidenhead', 'Wokingham'],
      'England - North West': ['Greater Manchester (Manchester/Salford/Bolton)', 'Merseyside (Liverpool)', 'Lancashire (Preston/Blackpool)', 'Cheshire East', 'Cheshire West and Chester', 'Warrington', 'Cumbria (Carlisle)'],
      'England - West Midlands': ['Birmingham', 'Coventry', 'Dudley', 'Sandwell', 'Solihull', 'Walsall', 'Wolverhampton', 'Staffordshire (Stoke-on-Trent)', 'Warwickshire', 'Worcestershire', 'Shropshire', 'Telford and Wrekin', 'Herefordshire'],
      'England - Yorkshire and the Humber': ['Leeds', 'Sheffield', 'Bradford', 'Wakefield', 'Kirklees (Huddersfield)', 'York', 'Kingston upon Hull', 'East Riding of Yorkshire', 'Doncaster', 'Rotherham', 'Barnsley', 'North Yorkshire'],
      'England - South West': ['Bristol', 'Bath and North East Somerset', 'Plymouth', 'Bournemouth, Christchurch and Poole', 'Cornwall', 'Devon (Exeter)', 'Dorset', 'Gloucestershire (Gloucester/Cheltenham)', 'Somerset', 'South Gloucestershire', 'Swindon', 'Wiltshire'],
      'England - East of England': ['Cambridgeshire (Cambridge/Peterborough)', 'Essex (Chelmsford/Colchester/Southend)', 'Hertfordshire (Watford/St Albans)', 'Norfolk (Norwich)', 'Suffolk (Ipswich)', 'Bedfordshire (Luton/Bedford)'],
      'England - East Midlands': ['Derby', 'Derbyshire', 'Leicester', 'Leicestershire', 'Lincolnshire (Lincoln)', 'Northamptonshire', 'Nottingham', 'Nottinghamshire', 'Rutland'],
      'England - North East': ['Newcastle upon Tyne', 'Sunderland', 'Gateshead', 'North Tyneside', 'South Tyneside', 'County Durham (Durham)', 'Middlesbrough', 'Stockton-on-Tees', 'Northumberland', 'Darlington', 'Hartlepool', 'Redcar and Cleveland'],
      'Scotland': ['City of Edinburgh', 'Glasgow City', 'Aberdeen City', 'Dundee City', 'Highland (Inverness)', 'Fife', 'South Lanarkshire', 'North Lanarkshire', 'Aberdeenshire', 'Renfrewshire', 'Falkirk', 'Perth and Kinross', 'Dumfries and Galloway', 'West Lothian', 'East Ayrshire', 'Stirling', 'Scottish Borders'],
      'Wales': ['Cardiff', 'Swansea', 'Newport', 'Rhondda Cynon Taf', 'Carmarthenshire', 'Caerphilly', 'Flintshire', 'Wrexham', 'Bridgend', 'Neath Port Talbot', 'Gwynedd', 'Vale of Glamorgan', 'Pembrokeshire', 'Powys', 'Conwy', 'Monmouthshire', 'Torfaen', 'Denbighshire', 'Ceredigion', 'Isle of Anglesey', 'Blaenau Gwent', 'Merthyr Tydfil'],
      'Northern Ireland': ['Belfast', 'Derry City and Strabane', 'Armagh City, Banbridge and Craigavon', 'Lisburn and Castlereagh', 'Newry, Mourne and Down', 'Antrim and Newtownabbey', 'Ards and North Down', 'Causeway Coast and Glens', 'Mid and East Antrim', 'Mid Ulster', 'Fermanagh and Omagh'],
    },
  },

  'Canada': {
    states: [
      'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba',
      'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador',
      'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut'
    ],
    districts: {
      Ontario: ['City of Toronto', 'City of Ottawa', 'Peel Region (Mississauga/Brampton)', 'York Region (Markham/Richmond Hill/Vaughan)', 'Durham Region (Oshawa/Pickering)', 'Halton Region (Oakville/Burlington)', 'City of Hamilton', 'Waterloo Region (Kitchener/Waterloo/Cambridge)', 'Middlesex County (London)', 'Niagara Region (Niagara Falls/St. Catharines)', 'Simcoe County (Barrie)', 'City of Windsor / Essex County', 'City of Greater Sudbury', 'City of Kingston', 'City of Thunder Bay', 'City of Peterborough'],
      Quebec: ['Montreal (Montréal)', 'Quebec City (Québec)', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Levis', 'Trois-Rivières', 'Terrebonne', 'Saint-Jean-sur-Richelieu', 'Repentigny', 'Drummondville', 'Brossard', 'Saint-Jérôme', 'Granby'],
      'British Columbia': ['Metro Vancouver (Vancouver/Surrey/Burnaby/Richmond)', 'Capital Regional District (Victoria/Saanich)', 'Central Okanagan (Kelowna)', 'Fraser Valley (Abbotsford/Chilliwack)', 'Nanaimo Regional District', 'Thompson-Nicola (Kamloops)', 'Prince George / Fraser-Fort George', 'Okanagan-Similkameen (Penticton)'],
      Alberta: ['Calgary', 'Edmonton', 'Red Deer', 'Strathcona County (Sherwood Park)', 'Lethbridge', 'Wood Buffalo (Fort McMurray)', 'St. Albert', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc'],
      Manitoba: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Winkler', 'Selkirk', 'Dauphin'],
      Saskatchewan: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Yorkton', 'North Battleford'],
      'Nova Scotia': ['Halifax Regional Municipality', 'Cape Breton Regional Municipality (Sydney)', 'Kings County', 'Colchester County', 'Lunenburg County', 'Pictou County'],
      'New Brunswick': ['Moncton', 'Saint John', 'Fredericton', 'Dieppe', 'Miramichi', 'Edmundston', 'Bathurst'],
    },
  },

  'Australia': {
    states: [
      'New South Wales', 'Victoria', 'Queensland', 'Western Australia',
      'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'
    ],
    districts: {
      'New South Wales': ['Greater Sydney (City/Parramatta/Blacktown/North Shore)', 'Central Coast (Gosford/Wyong)', 'Hunter (Newcastle/Maitland)', 'Illawarra (Wollongong)', 'Mid North Coast (Coffs Harbour/Port Macquarie)', 'New England (Tamworth/Armidale)', 'Riverina (Wagga Wagga)', 'Central West (Orange/Bathurst/Dubbo)', 'Northern Rivers (Tweed/Lismore)', 'South Coast', 'Southern Highlands'],
      'Victoria': ['Greater Melbourne (City/Monash/Darebin/Brimbank/Casey)', 'Greater Geelong', 'City of Ballarat', 'Greater Bendigo', 'City of Greater Shepparton', 'Latrobe City (Traralgon/Morwell)', 'Warrnambool', 'Mildura', 'Wodonga', 'Wangaratta', 'Mornington Peninsula', 'Yarra Ranges', 'Bellarine Peninsula'],
      'Queensland': ['Greater Brisbane', 'City of Gold Coast', 'Sunshine Coast Region', 'Townsville City', 'Cairns Regional Council', 'Toowoomba Region', 'Mackay Region', 'Rockhampton Region', 'Bundaberg Region', 'Hervey Bay / Fraser Coast', 'Gladstone Region', 'Ipswich City', 'Logan City', 'Moreton Bay Region', 'Redland City'],
      'Western Australia': ['Greater Perth (City/Stirling/Joondalup/Fremantle/Swan)', 'South West (Bunbury/Busselton/Margaret River)', 'Peel (Mandurah)', 'Great Southern (Albany)', 'Pilbara (Karratha/Port Hedland)', 'Goldfields-Esperance (Kalgoorlie)', 'Mid West (Geraldton)', 'Kimberley (Broome)'],
      'South Australia': ['Greater Adelaide (Adelaide/Salisbury/Marion/Charles Sturt)', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta', 'Port Lincoln', 'Victor Harbor', 'Gawler', 'Barossa Valley'],
      'Tasmania': ['City of Hobart', 'City of Launceston', 'City of Devonport', 'City of Burnie', 'Kingborough', 'Clarence', 'Glenorchy'],
      'Australian Capital Territory': ['North Canberra (Civic/Dickson)', 'South Canberra (Barton/Kingston)', 'Belconnen', 'Woden Valley', 'Tuggeranong', 'Gungahlin', 'Weston Creek', 'Molonglo Valley'],
    },
  },

  'Germany': {
    states: [
      'Baden-Württemberg', 'Bavaria (Bayern)', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse (Hessen)', 'Lower Saxony (Niedersachsen)', 'Mecklenburg-Vorpommern',
      'North Rhine-Westphalia (Nordrhein-Westfalen)', 'Rhineland-Palatinate (Rheinland-Pfalz)',
      'Saarland', 'Saxony (Sachsen)', 'Saxony-Anhalt (Sachsen-Anhalt)',
      'Schleswig-Holstein', 'Thuringia (Thüringen)'
    ],
    districts: {
      'Bavaria (Bayern)': ['Munich (München)', 'Nuremberg (Nürnberg)', 'Augsburg', 'Regensburg', 'Ingolstadt', 'Würzburg', 'Fürth', 'Erlangen', 'Bamberg', 'Bayreuth', 'Landshut', 'Aschaffenburg', 'Kempten', 'Rosenheim'],
      'Baden-Württemberg': ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg im Breisgau', 'Heidelberg', 'Heilbronn', 'Ulm', 'Pforzheim', 'Reutlingen', 'Esslingen', 'Ludwigsburg', 'Tübingen', 'Konstanz', 'Villingen-Schwenningen'],
      'North Rhine-Westphalia (Nordrhein-Westfalen)': ['Cologne (Köln)', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Gelsenkirchen', 'Mönchengladbach', 'Aachen', 'Krefeld', 'Oberhausen'],
      'Hesse (Hessen)': ['Frankfurt am Main', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach am Main', 'Hanau', 'Gießen', 'Marburg', 'Fulda', 'Rüsselsheim'],
      'Lower Saxony (Niedersachsen)': ['Hanover (Hannover)', 'Braunschweig', 'Oldenburg', 'Osnabrück', 'Wolfsburg', 'Göttingen', 'Salzgitter', 'Hildesheim', 'Delmenhorst', 'Wilhelmshaven', 'Lüneburg', 'Celle'],
      'Saxony (Sachsen)': ['Leipzig', 'Dresden', 'Chemnitz', 'Zwickau', 'Plauen', 'Görlitz', 'Bautzen', 'Freiberg'],
      'Berlin': ['Mitte', 'Friedrichshain-Kreuzberg', 'Pankow', 'Charlottenburg-Wilmersdorf', 'Spandau', 'Steglitz-Zehlendorf', 'Tempelhof-Schöneberg', 'Neukölln', 'Treptow-Köpenick', 'Marzahn-Hellersdorf', 'Lichtenberg', 'Reinickendorf'],
      'Hamburg': ['Hamburg-Mitte', 'Altona', 'Eimsbüttel', 'Hamburg-Nord', 'Wandsbek', 'Bergedorf', 'Harburg'],
    },
  },

  'France': {
    states: [
      'Île-de-France (Paris)', 'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany (Bretagne)',
      'Centre-Val de Loire', 'Corsica (Corse)', 'Grand Est', 'Hauts-de-France',
      'Normandy (Normandie)', 'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire',
      'Provence-Alpes-Côte d\'Azur', 'Guadeloupe', 'Martinique', 'French Guiana', 'Réunion', 'Mayotte'
    ],
    districts: {
      'Île-de-France (Paris)': ['Paris (75)', 'Seine-et-Marne (77)', 'Yvelines (78)', 'Essonne (91)', 'Hauts-de-Seine (92)', 'Seine-Saint-Denis (93)', 'Val-de-Marne (94)', 'Val-d\'Oise (95)'],
      'Provence-Alpes-Côte d\'Azur': ['Bouches-du-Rhône (Marseille/Aix)', 'Alpes-Maritimes (Nice/Cannes)', 'Var (Toulon)', 'Vaucluse (Avignon)', 'Hautes-Alpes (Gap)', 'Alpes-de-Haute-Provence (Digne)'],
      'Auvergne-Rhône-Alpes': ['Rhône / Métropole de Lyon', 'Isère (Grenoble)', 'Haute-Savoie (Annecy)', 'Puy-de-Dôme (Clermont-Ferrand)', 'Loire (Saint-Étienne)', 'Ain (Bourg-en-Bresse)', 'Drôme (Valence)', 'Savoie (Chambéry)'],
      'Occitanie': ['Haute-Garonne (Toulouse)', 'Hérault (Montpellier)', 'Gard (Nîmes)', 'Pyrénées-Orientales (Perpignan)', 'Tarn (Albi)', 'Aude (Carcassonne)', 'Aveyron (Rodez)', 'Hautes-Pyrénées (Tarbes)'],
      'Nouvelle-Aquitaine': ['Gironde (Bordeaux)', 'Pyrénées-Atlantiques (Pau/Bayonne)', 'Charente-Maritime (La Rochelle)', 'Vienne (Poitiers)', 'Haute-Vienne (Limoges)', 'Landes (Mont-de-Marsan)', 'Dordogne (Périgueux)'],
      'Hauts-de-France': ['Nord (Lille/Dunkerque/Valenciennes)', 'Pas-de-Calais (Calais/Arras/Boulogne)', 'Oise (Beauvais/Compiègne)', 'Somme (Amiens)', 'Aisne (Laon/Saint-Quentin)'],
      'Grand Est': ['Bas-Rhin (Strasbourg)', 'Haut-Rhin (Mulhouse/Colmar)', 'Meurthe-et-Moselle (Nancy)', 'Moselle (Metz)', 'Marne (Reims)', 'Aube (Troyes)'],
      'Pays de la Loire': ['Loire-Atlantique (Nantes/Saint-Nazaire)', 'Maine-et-Loire (Angers)', 'Vendée (La Roche-sur-Yon)', 'Sarthe (Le Mans)', 'Mayenne (Laval)'],
      'Brittany (Bretagne)': ['Ille-et-Vilaine (Rennes)', 'Finistère (Brest/Quimper)', 'Morbihan (Vannes/Lorient)', 'Côtes-d\'Armor (Saint-Brieuc)'],
    },
  },

  'Japan': {
    states: [
      'Tokyo', 'Kanagawa (Yokohama)', 'Osaka', 'Aichi (Nagoya)', 'Saitama', 'Chiba',
      'Hyogo (Kobe)', 'Hokkaido (Sapporo)', 'Fukuoka', 'Shizuoka', 'Hiroshima', 'Kyoto',
      'Miyagi (Sendai)', 'Niigata', 'Kumamoto', 'Okayama', 'Okinawa', 'Nagano', 'Gifu',
      'Ibaraki', 'Tochigi', 'Gunma', 'Mie', 'Shiga', 'Nara', 'Kagoshima', 'Ehime', 'Ishikawa'
    ],
    districts: {
      'Tokyo': ['Shinjuku City', 'Shibuya City', 'Chiyoda City', 'Minato City', 'Chuo City', 'Setagaya City', 'Meguro City', 'Ota City', 'Toshima City', 'Shinagawa City', 'Nakano City', 'Suginami City', 'Koto City', 'Edogawa City', 'Hachioji City', 'Machida City', 'Tachikawa City', 'Musashino City'],
      'Kanagawa (Yokohama)': ['Yokohama City (Naka/Nishi/Kohoku)', 'Kawasaki City', 'Sagamihara City', 'Yokosuka City', 'Fujisawa City', 'Kamakura City', 'Odawara City', 'Chigasaki City', 'Atsugi City', 'Yamato City'],
      'Osaka': ['Osaka City (Kita/Chuo/Naniwa/Tennoji)', 'Sakai City', 'Higashiosaka City', 'Hirakata City', 'Toyonaka City', 'Suita City', 'Takatsuki City', 'Ibaraki City', 'Yao City', 'Kishiwada City'],
      'Aichi (Nagoya)': ['Nagoya City (Naka/Nakamura/Chikusa)', 'Toyota City', 'Okazaki City', 'Ichinomiya City', 'Toyohashi City', 'Kasugai City', 'Anjo City', 'Komaki City', 'Kariya City'],
      'Hokkaido (Sapporo)': ['Sapporo City (Chuo/Kita/Higashi/Shiroishi)', 'Asahikawa City', 'Hakodate City', 'Kushiro City', 'Tomakomai City', 'Obihiro City', 'Otaru City', 'Kitami City'],
      'Fukuoka': ['Fukuoka City (Hakata/Chuo/Higashi/Minami)', 'Kitakyushu City', 'Kurume City', 'Iizuka City', 'Omuta City', 'Kasuga City', 'Onojo City', 'Munakata City'],
      'Kyoto': ['Kyoto City (Shimogyo/Nakagyo/Higashiyama/Kamigyo)', 'Uji City', 'Kameoka City', 'Maizuru City', 'Joyo City', 'Nagaokakyo City', 'Fukuchiyama City'],
      'Hyogo (Kobe)': ['Kobe City (Chuo/Nada/Hyogo/Higashinada)', 'Himeji City', 'Nishinomiya City', 'Amagasaki City', 'Akashi City', 'Kakogawa City', 'Takarazuka City', 'Itami City'],
    },
  },

  'China': {
    states: [
      'Beijing', 'Shanghai', 'Guangdong (Guangzhou/Shenzhen)', 'Zhejiang (Hangzhou)',
      'Jiangsu (Nanjing/Suzhou)', 'Sichuan (Chengdu)', 'Shandong', 'Henan', 'Hubei (Wuhan)',
      'Fujian', 'Hunan', 'Anhui', 'Hebei', 'Shaanxi (Xi\'an)', 'Chongqing', 'Tianjin',
      'Hong Kong', 'Macau', 'Guangxi', 'Yunnan', 'Liaoning', 'Jiangxi', 'Jilin', 'Heilongjiang',
      'Shanxi', 'Guizhou', 'Inner Mongolia', 'Xinjiang', 'Gansu', 'Hainan', 'Ningxia', 'Qinghai', 'Tibet'
    ],
    districts: {
      'Guangdong (Guangzhou/Shenzhen)': ['Guangzhou (Tianhe/Yuexiu/Haizhu/Baiyun)', 'Shenzhen (Nanshan/Futian/Luohu/Baoan)', 'Dongguan', 'Foshan (Nanhai/Shunde)', 'Zhongshan', 'Zhuhai', 'Huizhou', 'Jiangmen', 'Shantou', 'Zhanjiang'],
      'Beijing': ['Chaoyang District', 'Haidian District', 'Dongcheng District', 'Xicheng District', 'Fengtai District', 'Shijingshan District', 'Tongzhou District', 'Changping District', 'Daxing District', 'Shunyi District', 'Fangshan District'],
      'Shanghai': ['Pudong New Area', 'Huangpu District', 'Xuhui District', 'Jing\'an District', 'Changning District', 'Putuo District', 'Hongkou District', 'Yangpu District', 'Minhang District', 'Baoshan District', 'Jiading District', 'Songjiang District'],
      'Zhejiang (Hangzhou)': ['Hangzhou (Xihu/Shangcheng/Gongshu/Binjiang/Yuhang)', 'Ningbo (Haishu/Yinzhou)', 'Wenzhou', 'Shaoxing', 'Jiaxing', 'Jinhua (Yiwu)', 'Taizhou', 'Huzhou', 'Quzhou', 'Zhoushan', 'Lishui'],
      'Jiangsu (Nanjing/Suzhou)': ['Nanjing (Xuanwu/Qinhuai/Gulou/Jiangning)', 'Suzhou (Gusu/Wuzhong/SIP/Kunshan)', 'Wuxi', 'Changzhou', 'Nantong', 'Xuzhou', 'Yangzhou', 'Yancheng', 'Taizhou', 'Zhenjiang', 'Huai\'an', 'Lianyungang', 'Suqian'],
      'Sichuan (Chengdu)': ['Chengdu (Jinjiang/Qingyang/Wuhou/Gaoxin)', 'Mianyang', 'Nanchong', 'Yibin', 'Luzhou', 'Deyang', 'Leshan', 'Dazhou', 'Zigong', 'Panzhihua', 'Neijiang', 'Guangyuan', 'Suining'],
      'Hubei (Wuhan)': ['Wuhan (Jianghan/Wuchang/Hongshan/Jiangan/Hanyang)', 'Xiangyang', 'Yichang', 'Jingzhou', 'Huanggang', 'Xiaogan', 'Shiyan', 'Jingmen', 'Ezhou', 'Xianning'],
      'Shaanxi (Xi\'an)': ['Xi\'an (Yanta/Beilin/Weiyang/Xincheng/Lianhu)', 'Baoji', 'Xianyang', 'Weinan', 'Hanzhong', 'Yulin', 'Yan\'an', 'Ankang', 'Shangluo', 'Tongchuan'],
    },
  },

  'Brazil': {
    states: [
      'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul',
      'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina', 'Goiás', 'Maranhão', 'Amazonas',
      'Distrito Federal (Brasília)', 'Espírito Santo', 'Mato Grosso', 'Mato Grosso do Sul',
      'Paraíba', 'Rio Grande do Norte', 'Alagoas', 'Piauí', 'Sergipe', 'Rondônia', 'Tocantins',
      'Acre', 'Amapá', 'Roraima'
    ],
    districts: {
      'São Paulo': ['São Paulo (Capital/Centro/Zona Sul/Zona Oeste)', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'São José dos Campos', 'Ribeirão Preto', 'Sorocaba', 'Santos', 'Mauá', 'São José do Rio Preto', 'Mogi das Cruzes', 'Diadema', 'Jundiaí', 'Piracicaba', 'Bauru', 'Franca'],
      'Rio de Janeiro': ['Rio de Janeiro (Capital/Zona Sul/Zona Norte/Barra)', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'Campos dos Goytacazes', 'São João de Meriti', 'Petrópolis', 'Volta Redonda', 'Macaé', 'Magé', 'Itaboraí', 'Cabo Frio', 'Angra dos Reis', 'Nova Friburgo'],
      'Minas Gerais': ['Belo Horizonte (Capital)', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga', 'Sete Lagoas', 'Divinópolis', 'Santa Luzia', 'Ibirité', 'Poços de Caldas', 'Patos de Minas'],
      'Bahia': ['Salvador (Capital)', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Itabuna', 'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Teixeira de Freitas', 'Barreiras', 'Alagoinhas', 'Porto Seguro', 'Simões Filho'],
      'Paraná': ['Curitiba (Capital)', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá', 'Araucária', 'Toledo', 'Apucarana', 'Pinhais', 'Campo Largo'],
      'Rio Grande do Sul': ['Porto Alegre (Capital)', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande', 'Alvorada', 'Passo Fundo', 'Uruguaiana', 'Santa Cruz do Sul', 'Bento Gonçalves'],
      'Distrito Federal (Brasília)': ['Brasília (Plano Piloto)', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Águas Claras', 'Gama', 'Guará', 'Santa Maria', 'Sobradinho', 'Recanto das Emas', 'Vicente Pires', 'Planaltina', 'São Sebastião', 'Riacho Fundo', 'Lago Sul / Lago Norte'],
    },
  },

  'Mexico': {
    states: [
      'Mexico City (CDMX)', 'Jalisco (Guadalajara)', 'Nuevo León (Monterrey)', 'Puebla',
      'State of Mexico (Edomex)', 'Guanajuato', 'Veracruz', 'Chihuahua', 'Yucatán', 'Baja California',
      'Coahuila', 'Michoacán', 'Sonora', 'Tamaulipas', 'Sinaloa', 'San Luis Potosí', 'Querétaro',
      'Hidalgo', 'Morelos', 'Quintana Roo (Cancún)', 'Aguascalientes', 'Durango', 'Tabasco',
      'Chiapas', 'Oaxaca', 'Zacatecas', 'Tlaxcala', 'Nayarit', 'Campeche', 'Colima', 'Baja California Sur'
    ],
    districts: {
      'Mexico City (CDMX)': ['Cuauhtémoc', 'Benito Juárez', 'Miguel Hidalgo', 'Coyoacán', 'Álvaro Obregón', 'Tlalpan', 'Gustavo A. Madero', 'Iztapalapa', 'Venustiano Carranza', 'Azcapotzalco', 'Cuajimalpa', 'Xochimilco', 'Iztacalco', 'Magdalena Contreras', 'Tláhuac', 'Milpa Alta'],
      'Jalisco (Guadalajara)': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco de Zúñiga', 'Puerto Vallarta', 'El Salto', 'Lagos de Moreno', 'Tepatitlán de Morelos', 'Ciudad Guzmán (Zapotlán el Grande)', 'Ocotlán'],
      'Nuevo León (Monterrey)': ['Monterrey', 'San Pedro Garza García', 'Guadalupe', 'San Nicolás de los Garza', 'Apodaca', 'General Escobedo', 'Santa Catarina', 'Juárez', 'García', 'Cadereyta Jiménez', 'Santiago', 'Linares'],
      'State of Mexico (Edomex)': ['Ecatepec de Morelos', 'Nezahualcóyotl', 'Toluca', 'Naucalpan de Juárez', 'Tlalnepantla de Baz', 'Chimalhuacán', 'Cuautitlán Izcalli', 'Tultitlán', 'Atizapán de Zaragoza', 'Ixtapaluca', 'Nicolás Romero', 'Tecámac', 'Valle de Chalco', 'Chalco', 'Coacalco de Berriozábal', 'Huixquilucan', 'Metepec'],
      'Puebla': ['Puebla (Heroica Puebla de Zaragoza)', 'Tehuacán', 'San Martín Texmelucan', 'Atlixco', 'San Pedro Cholula', 'San Andrés Cholula', 'Amozoc', 'Huauchinango', 'Teziutlán', 'Cuautlancingo'],
      'Yucatán': ['Mérida', 'Kanasín', 'Valladolid', 'Tizimín', 'Progreso', 'Umán', 'Tekax', 'Motul', 'Ticul', 'Hunucmá'],
      'Baja California': ['Tijuana', 'Mexicali', 'Ensenada', 'Playas de Rosarito', 'Tecate', 'San Quintín', 'San Felipe'],
      'Quintana Roo (Cancún)': ['Benito Juárez (Cancún)', 'Solidaridad (Playa del Carmen)', 'Othón P. Blanco (Chetumal)', 'Cozumel', 'Tulum', 'Isla Mujeres', 'Puerto Morelos', 'Bacalar'],
    },
  },

  'Italy': {
    states: [
      'Lombardy (Lombardia)', 'Lazio (Rome)', 'Campania (Naples)', 'Veneto (Venice/Verona)',
      'Emilia-Romagna (Bologna)', 'Piedmont (Piemonte/Turin)', 'Sicily (Sicilia/Palermo)',
      'Tuscany (Toscana/Florence)', 'Apulia (Puglia/Bari)', 'Liguria (Genoa)',
      'Calabria', 'Sardinia (Sardegna/Cagliari)', 'Marche (Ancona)', 'Abruzzo (L\'Aquila/Pescara)',
      'Friuli-Venezia Giulia (Trieste)', 'Trentino-Alto Adige / South Tyrol (Trento/Bolzano)',
      'Umbria (Perugia)', 'Basilicata (Potenza)', 'Molise (Campobasso)', 'Aosta Valley (Valle d\'Aosta)'
    ],
    districts: {
      'Lombardy (Lombardia)': ['Metropolitan City of Milan (Milano)', 'Brescia', 'Bergamo', 'Monza and Brianza', 'Varese', 'Como', 'Pavia', 'Mantua (Mantova)', 'Cremona', 'Lecco', 'Lodi', 'Sondrio'],
      'Lazio (Rome)': ['Metropolitan City of Rome Capital (Roma)', 'Latina', 'Frosinone', 'Viterbo', 'Rieti'],
      'Campania (Naples)': ['Metropolitan City of Naples (Napoli)', 'Salerno', 'Caserta', 'Avellino', 'Benevento'],
      'Veneto (Venice/Verona)': ['Metropolitan City of Venice (Venezia)', 'Verona', 'Padua (Padova)', 'Vicenza', 'Treviso', 'Rovigo', 'Belluno'],
      'Emilia-Romagna (Bologna)': ['Metropolitan City of Bologna', 'Modena', 'Reggio Emilia', 'Parma', 'Ravenna', 'Forlì-Cesena', 'Rimini', 'Ferrara', 'Piacenza'],
      'Piedmont (Piemonte/Turin)': ['Metropolitan City of Turin (Torino)', 'Cuneo', 'Alessandria', 'Novara', 'Asti', 'Biella', 'Vercelli', 'Verbano-Cusio-Ossola'],
      'Tuscany (Toscana/Florence)': ['Metropolitan City of Florence (Firenze)', 'Pisa', 'Lucca', 'Arezzo', 'Pistoia', 'Livorno', 'Siena', 'Prato', 'Grosseto', 'Massa and Carrara'],
      'Sicily (Sicilia/Palermo)': ['Metropolitan City of Palermo', 'Metropolitan City of Catania', 'Metropolitan City of Messina', 'Syracuse (Siracusa)', 'Trapani', 'Ragusa', 'Agrigento', 'Caltanissetta', 'Enna'],
    },
  },

  'Spain': {
    states: [
      'Community of Madrid (Madrid)', 'Catalonia (Barcelona)', 'Andalusia (Andalucía/Seville/Málaga)',
      'Valencian Community (Valencia/Alicante)', 'Galicia (A Coruña/Vigo)', 'Castile and León (Valladolid)',
      'Basque Country (País Vasco/Bilbao/San Sebastián)', 'Castilla-La Mancha (Toledo/Albacete)',
      'Canary Islands (Canarias/Tenerife/Las Palmas)', 'Region of Murcia (Murcia)',
      'Aragon (Aragón/Zaragoza)', 'Extremadura (Badajoz/Cáceres)', 'Balearic Islands (Baleares/Mallorca/Ibiza)',
      'Asturias (Oviedo/Gijón)', 'Navarre (Navarra/Pamplona)', 'Cantabria (Santander)',
      'La Rioja (Logroño)', 'Ceuta', 'Melilla'
    ],
    districts: {
      'Community of Madrid (Madrid)': ['City of Madrid (Centro/Salamanca/Chamberí/Chamartín)', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'Getafe', 'Alcorcón', 'Torrejón de Ardoz', 'Parla', 'Alcobendas', 'Las Rozas de Madrid', 'San Sebastián de los Reyes', 'Pozuelo de Alarcón', 'Rivas-Vaciamadrid', 'Coslada', 'Valdemoro', 'Majadahonda', 'Collado Villalba'],
      'Catalonia (Barcelona)': ['Barcelona (Eixample/Ciutat Vella/Gràcia/Les Corts)', 'L\'Hospitalet de Llobregat', 'Badalona', 'Terrassa', 'Sabadell', 'Mataró', 'Santa Coloma de Gramenet', 'Sant Cugat del Vallès', 'Cornellà de Llobregat', 'Sant Boi de Llobregat', 'Manresa', 'Rubí', 'Vilanova i la Geltrú', 'Girona', 'Tarragona', 'Lleida', 'Reus'],
      'Andalusia (Andalucía/Seville/Málaga)': ['Seville (Sevilla)', 'Málaga', 'Córdoba', 'Granada', 'Jerez de la Frontera', 'Almería', 'Huelva', 'Marbella', 'Dos Hermanas', 'Algeciras', 'Jaén', 'Cádiz', 'San Fernando', 'Roquetas de Mar', 'El Puerto de Santa María', 'Mijas', 'Fuengirola', 'Vélez-Málaga'],
      'Valencian Community (Valencia/Alicante)': ['Valencia (València)', 'Alicante (Alacant)', 'Elche (Elx)', 'Castellón de la Plana (Castelló)', 'Torrevieja', 'Torrent', 'Orihuela', 'Gandia', 'Paterna', 'Benidorm', 'Sagunto (Sagunt)', 'Alcoy (Alcoi)', 'Elda'],
      'Basque Country (País Vasco/Bilbao/San Sebastián)': ['Biscay (Bizkaia/Bilbao/Barakaldo/Getxo)', 'Gipuzkoa (San Sebastián/Donostia/Irun)', 'Álava (Araba/Vitoria-Gasteiz)'],
      'Galicia (A Coruña/Vigo)': ['A Coruña (Corunna/Santiago de Compostela/Ferrol)', 'Pontevedra (Vigo/Pontevedra/Vilagarcía)', 'Ourense', 'Lugo'],
    },
  },

  'Netherlands': {
    states: [
      'North Holland (Noord-Holland/Amsterdam)', 'South Holland (Zuid-Holland/Rotterdam/The Hague)',
      'Utrecht', 'North Brabant (Noord-Brabant/Eindhoven/Tilburg)', 'Gelderland (Arnhem/Nijmegen)',
      'Overijssel (Enschede/Zwolle)', 'Limburg (Maastricht/Venlo)', 'Friesland (Fryslân/Leeuwarden)',
      'Groningen', 'Drenthe (Assen/Emmen)', 'Zeeland (Middelburg/Vlissingen)', 'Flevoland (Almere/Lelystad)'
    ],
    districts: {
      'North Holland (Noord-Holland/Amsterdam)': ['Amsterdam (Centrum/Zuid/West/Oost/Noord)', 'Haarlem', 'Zaanstad (Zaandam)', 'Haarlemmermeer (Hoofddorp/Schiphol)', 'Alkmaar', 'Amstelveen', 'Hilversum', 'Purmerend', 'Hoorn', 'Velsen (IJmuiden)', 'Den Helder'],
      'South Holland (Zuid-Holland/Rotterdam/The Hague)': ['Rotterdam', 'The Hague (Den Haag / \'s-Gravenhage)', 'Zoetermeer', 'Leiden', 'Dordrecht', 'Alphen aan den Rijn', 'Westland', 'Delft', 'Schiedam', 'Gouda', 'Vlaardingen', 'Capelle aan den IJssel', 'Katwijk'],
      'Utrecht': ['City of Utrecht', 'Amersfoort', 'Veenendaal', 'Zeist', 'Nieuwegein', 'Stichtse Vecht (Maarssen)', 'Houten', 'Woerden', 'Soest', 'IJsselstein'],
      'North Brabant (Noord-Brabant/Eindhoven/Tilburg)': ['Eindhoven', 'Tilburg', 'Breda', '\'s-Hertogenbosch (Den Bosch)', 'Helmond', 'Oss', 'Roosendaal', 'Bergen op Zoom', 'Oosterhout', 'Waalwijk'],
      'Gelderland (Arnhem/Nijmegen)': ['Nijmegen', 'Arnhem', 'Apeldoorn', 'Ede', 'Barneveld', 'Doetinchem', 'Overbetuwe', 'Lingewaard', 'Harderwijk', 'Zutphen'],
    },
  },

  'South Africa': {
    states: [
      'Gauteng (Johannesburg/Pretoria)', 'Western Cape (Cape Town)', 'KwaZulu-Natal (Durban)',
      'Eastern Cape (Gqeberha/East London)', 'Free State (Bloemfontein)', 'Limpopo (Polokwane)',
      'Mpumalanga (Mbombela/Nelspruit)', 'North West (Rustenburg/Mahikeng)', 'Northern Cape (Kimberley)'
    ],
    districts: {
      'Gauteng (Johannesburg/Pretoria)': ['City of Johannesburg (Sandton/Soweto/Randburg)', 'City of Tshwane (Pretoria/Centurion)', 'Ekurhuleni (East Rand/Kempton Park/Boksburg)', 'Sedibeng (Vereeniging)', 'West Rand (Krugersdorp/Randfontein)'],
      'Western Cape (Cape Town)': ['City of Cape Town (CBD/Southern Suburbs/Bellville/Mitchells Plain)', 'Cape Winelands (Stellenbosch/Paarl/Worcester)', 'Garden Route (George/Mossel Bay/Knysna)', 'Overberg (Hermanus)', 'West Coast (Saldanha Bay)', 'Central Karoo (Beaufort West)'],
      'KwaZulu-Natal (Durban)': ['eThekwini (Durban/Umhlanga/Pinetown)', 'uMgungundlovu (Pietermaritzburg)', 'King Cetshwayo (Richards Bay)', 'uThukela (Ladysmith)', 'iLembe (Ballito/KwaDukuza)', 'Amajuba (Newcastle)', 'Zululand', 'Ray Nkonyeni (Port Shepstone)'],
      'Eastern Cape (Gqeberha/East London)': ['Nelson Mandela Bay (Gqeberha / Port Elizabeth)', 'Buffalo City (East London)', 'OR Tambo (Mthatha)', 'Sarah Baartman', 'Chris Hani', 'Amathole'],
    },
  },

  'Nigeria': {
    states: [
      'Lagos', 'Federal Capital Territory (Abuja)', 'Kano', 'Rivers (Port Harcourt)',
      'Oyo (Ibadan)', 'Kaduna', 'Ogun (Abeokuta)', 'Delta (Warri/Asaba)', 'Edo (Benin City)',
      'Anambra (Awka/Onitsha)', 'Enugu', 'Akwa Ibom (Uyo)', 'Abia (Umuahia/Aba)',
      'Plateau (Jos)', 'Kwara (Ilorin)', 'Osun (Osogbo)', 'Imo (Owerri)', 'Ondo (Akure)',
      'Cross River (Calabar)', 'Borno (Maiduguri)', 'Benue (Makurdi)', 'Niger (Minna)',
      'Kogi (Lokoja)', 'Sokoto', 'Adamawa (Yola)', 'Bauchi', 'Katsina', 'Gombe', 'Nasarawa',
      'Ekiti (Ado-Ekiti)', 'Ebonyi (Abakaliki)', 'Taraba (Jalingo)', 'Kebbi', 'Zamfara', 'Jigawa', 'Yobe', 'Bayelsa (Yenagoa)'
    ],
    districts: {
      'Lagos': ['Lagos Island', 'Lagos Mainland', 'Ikeja', 'Eti-Osa (Victoria Island/Lekki)', 'Surulere', 'Alimosho', 'Oshodi-Isolo', 'Kosofe', 'Amuwo-Odofin', 'Ikorodu', 'Agege', 'Apapa', 'Mushin', 'Ifako-Ijaiye', 'Badagry', 'Epe', 'Ojo', 'Somolu', 'Ajeromi-Ifelodun', 'Ibeju-Lekki'],
      'Federal Capital Territory (Abuja)': ['Abuja Municipal (Garki/Wuse/Maitama/Asokoro/Jabi)', 'Bwari (Kubwa)', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
      'Rivers (Port Harcourt)': ['Port Harcourt (Old GRA/New GRA)', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo', 'Okrika', 'Degema', 'Bonny', 'Ahoada East', 'Ogu-Bolo'],
      'Oyo (Ibadan)': ['Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Akinyele', 'Egbeda', 'Oluyole', 'Lagelu', 'Ogbomoso North', 'Ogbomoso South', 'Oyo East', 'Oyo West', 'Iseyin'],
      'Kano': ['Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Tarauni', 'Nasarawa', 'Kumbotso', 'Ungogo', 'Wudil', 'Bichi'],
    },
  },

  'United Arab Emirates': {
    states: [
      'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'
    ],
    districts: {
      Dubai: ['Downtown Dubai / Business Bay', 'Dubai Marina / JBR', 'Jumeirah / Umm Suqeim', 'Deira', 'Bur Dubai', 'Al Barsha', 'Dubai Silicon Oasis', 'Al Quoz', 'Jebel Ali / Dubai South', 'Mirdif', 'Palm Jumeirah', 'Arabian Ranches', 'International City'],
      'Abu Dhabi': ['Abu Dhabi Island (Corniche/Al Khalidiyah/Al Reem)', 'Yas Island', 'Saadiyat Island', 'Al Ain City', 'Al Dhafra (Western Region)', 'Khalifa City', 'Mohammed Bin Zayed City', 'Al Maryah Island', 'Musaffah', 'Al Raha'],
      Sharjah: ['Al Majaz', 'Al Nahda', 'Al Qasimia', 'Muwaileh', 'Al Taawun', 'Al Khan', 'Khor Fakkan', 'Kalba', 'Al Dhaid'],
      Ajman: ['Ajman Downtown', 'Al Nuaimiya', 'Al Rashidiya', 'Al Jurf', 'Al Rawda', 'Al Mowaihat'],
      'Ras Al Khaimah': ['Al Nakheel', 'Al Hamra Village', 'Mina Al Arab', 'Al Dhait', 'Julphar'],
    },
  },

  'Saudi Arabia': {
    states: [
      'Riyadh Region', 'Makkah Region (Jeddah/Mecca)', 'Eastern Province (Dammam/Khobar/Dhahran)',
      'Madinah Region', 'Asir Region (Abha/Khamis Mushait)', 'Tabuk Region', 'Qassim Region (Buraidah/Unaizah)',
      'Hail Region', 'Jazan Region', 'Najran Region', 'Al Jouf Region', 'Northern Borders Region', 'Al Bahah Region'
    ],
    districts: {
      'Riyadh Region': ['Riyadh City (Al Olaya/Al Malqa/Al Sahafa/Al Yasmin)', 'Al Kharj', 'Diriyah', 'Al Majma\'ah', 'Ad Dawadimi', 'Wadi Ad Dawasir', 'Afif', 'Al Zulfi', 'Shaqra'],
      'Makkah Region (Jeddah/Mecca)': ['Jeddah (Al Rawdah/Al Zahra/Al Shati/Al Andalus)', 'Holy Makkah City (Mecca)', 'Taif', 'Rabigh', 'Al Qunfudhah', 'Al Lith', 'Khulais', 'King Abdullah Economic City (KAEC)'],
      'Eastern Province (Dammam/Khobar/Dhahran)': ['Dammam', 'Al Khobar', 'Dhahran', 'Jubail (Industrial/City)', 'Al Ahsa (Hofuf/Mubarraz)', 'Qatif', 'Hafr Al Batin', 'Ras Tanura', 'Khafji'],
      'Madinah Region': ['Al Madinah Al Munawwarah', 'Yanbu (Industrial/City)', 'Al Ula', 'Badr', 'Khaybar', 'Mahd Al Dhahab'],
    },
  },

  'Pakistan': {
    states: [
      'Punjab', 'Sindh', 'Khyber Pakhtunkhwa (KPK)', 'Balochistan',
      'Islamabad Capital Territory', 'Azad Jammu and Kashmir (AJK)', 'Gilgit-Baltistan'
    ],
    districts: {
      Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Gujrat', 'Rahim Yar Khan', 'Kasur', 'Sahiwal', 'Okara', 'Jhelum', 'Attock', 'Chiniot', 'Dera Ghazi Khan', 'Mianwali', 'Muzaffargarh'],
      Sindh: ['Karachi Central', 'Karachi East', 'Karachi South', 'Karachi West', 'Korangi (Karachi)', 'Malir (Karachi)', 'Keamari (Karachi)', 'Hyderabad', 'Sukkur', 'Larkana', 'Mirpur Khas', 'Nawabshah (Shaheed Benazirabad)', 'Thatta', 'Badin', 'Ghotki', 'Jacobabad'],
      'Islamabad Capital Territory': ['Islamabad City (Centrum/Blue Area/F-Sectors/G-Sectors)', 'Sector F-6 to F-11', 'Sector G-6 to G-14', 'Sector I-8 to I-14', 'Bahria Town Islamabad', 'DHA Islamabad', 'Bani Gala', 'Tarlai', 'Sihala'],
      'Khyber Pakhtunkhwa (KPK)': ['Peshawar', 'Mardan', 'Abbottabad', 'Swat (Mingora)', 'Nowshera', 'Charsadda', 'Swabi', 'Kohat', 'Mansehra', 'Dera Ismail Khan', 'Haripur', 'Bannu'],
      Balochistan: ['Quetta', 'Gwadar', 'Turbat (Kech)', 'Khuzdar', 'Hub', 'Sibi', 'Chaman', 'Loralai', 'Pishin', 'Zhob'],
    },
  },

  'Bangladesh': {
    states: [
      'Dhaka Division', 'Chittagong Division (Chattogram)', 'Rajshahi Division',
      'Khulna Division', 'Sylhet Division', 'Barishal Division', 'Rangpur Division', 'Mymensingh Division'
    ],
    districts: {
      'Dhaka Division': ['Dhaka District (Gulshan/Dhanmondi/Mirpur/Uttara)', 'Gazipur (Tongi/Gazipur Sadar)', 'Narayanganj', 'Tangail', 'Faridpur', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Kishoreganj', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur'],
      'Chittagong Division (Chattogram)': ['Chittagong (Agrabad/Nasirabad/Panchlaish)', 'Cox\'s Bazar', 'Cumilla (Comilla)', 'Brahmanbaria', 'Noakhali', 'Feni', 'Chandpur', 'Rangamati', 'Bandarban', 'Khagrachhari', 'Lakshmipur'],
      'Sylhet Division': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
      'Rajshahi Division': ['Rajshahi', 'Bogura (Bogra)', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapai Nawabganj', 'Joypurhat'],
      'Khulna Division': ['Khulna', 'Jashore (Jessore)', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah', 'Chuadanga', 'Magura', 'Meherpur', 'Narail'],
    },
  },

  'Philippines': {
    states: [
      'National Capital Region (Metro Manila)', 'Calabarzon (Region IV-A)', 'Central Luzon (Region III)',
      'Central Visayas (Region VII/Cebu)', 'Western Visayas (Region VI/Iloilo)', 'Davao Region (Region XI)',
      'Northern Mindanao (Region X/Cagayan de Oro)', 'Ilocos Region (Region I)', 'Bicol Region (Region V)',
      'Eastern Visayas (Region VIII)', 'Zamboanga Peninsula (Region IX)', 'Soccsksargen (Region XII)',
      'Cordillera Administrative Region (CAR/Baguio)', 'Mimaropa (Region IV-B)', 'Cagayan Valley (Region II)',
      'Caraga (Region XIII)', 'Bangsamoro (BARMM)'
    ],
    districts: {
      'National Capital Region (Metro Manila)': ['City of Manila', 'Quezon City', 'Makati City', 'Taguig City (BGC)', 'Pasig City (Ortigas)', 'Parañaque City', 'Mandaluyong City', 'Pasay City', 'Muntinlupa City (Alabang)', 'Caloocan City', 'Las Piñas City', 'Marikina City', 'Valenzuela City', 'Malabon City', 'Navotas City', 'San Juan City', 'Pateros'],
      'Central Visayas (Region VII/Cebu)': ['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Talisay City', 'Toledo City', 'Bohol (Tagbilaran)', 'Negros Oriental (Dumaguete)', 'Siquijor'],
      'Calabarzon (Region IV-A)': ['Cavite (Bacoor/Dasmarinas/Imus/General Trias)', 'Laguna (Santa Rosa/Calamba/San Pedro/Binan)', 'Batangas (Batangas City/Lipa)', 'Rizal (Antipolo/Taytay/Cainta)', 'Quezon (Lucena)'],
      'Davao Region (Region XI)': ['Davao City', 'Davao del Norte (Tagum/Panabo)', 'Davao del Sur (Digos)', 'Davao de Oro', 'Davao Oriental (Mati)', 'Davao Occidental'],
      'Central Luzon (Region III)': ['Pampanga (Angeles/San Fernando/Clark)', 'Bulacan (San Jose del Monte/Malolos/Meycauayan)', 'Bataan (Balanga)', 'Nueva Ecija (Cabanatuan)', 'Tarlac (Tarlac City)', 'Zambales (Olongapo/Subic)', 'Aurora'],
    },
  },

  'Indonesia': {
    states: [
      'Special Capital Region of Jakarta (DKI Jakarta)', 'West Java (Jawa Barat/Bandung)',
      'East Java (Jawa Timur/Surabaya)', 'Central Java (Jawa Tengah/Semarang)',
      'Banten (Tangerang/Serang)', 'Bali (Denpasar)', 'North Sumatra (Sumatera Utara/Medan)',
      'Riau (Pekanbaru)', 'South Sulawesi (Sulawesi Selatan/Makassar)', 'Special Region of Yogyakarta (DIY)',
      'South Sumatra (Sumatera Selatan/Palembang)', 'West Sumatra (Sumatera Barat/Padang)',
      'Lampung (Bandar Lampung)', 'East Kalimantan (Kalimantan Timur/Samarinda/Balikpapan)',
      'West Kalimantan (Pontianak)', 'South Kalimantan (Banjarmasin)', 'Aceh (Banda Aceh)',
      'Papua', 'West Nusa Tenggara (Lombok/Mataram)', 'East Nusa Tenggara (Kupang)'
    ],
    districts: {
      'Special Capital Region of Jakarta (DKI Jakarta)': ['Central Jakarta (Jakarta Pusat)', 'South Jakarta (Jakarta Selatan/Kuningan/Senopati)', 'West Jakarta (Jakarta Barat)', 'East Jakarta (Jakarta Timur)', 'North Jakarta (Jakarta Utara/Kelapa Gading/PIK)', 'Thousand Islands (Kepulauan Seribu)'],
      'West Java (Jawa Barat/Bandung)': ['Bandung City', 'Bekasi City', 'Depok City', 'Bogor City', 'Cimahi City', 'Bekasi Regency', 'Bogor Regency', 'Bandung Regency', 'West Bandung Regency', 'Karawang Regency', 'Cirebon City', 'Sukabumi City', 'Tasikmalaya City'],
      'East Java (Jawa Timur/Surabaya)': ['Surabaya City', 'Malang City', 'Sidoarjo Regency', 'Gresik Regency', 'Kediri City', 'Batu City', 'Madiun City', 'Pasuruan City', 'Probolinggo City', 'Mojokerto City', 'Banyuwangi Regency', 'Jember Regency'],
      'Central Java (Jawa Tengah/Semarang)': ['Semarang City', 'Surakarta (Solo)', 'Magelang City', 'Salatiga City', 'Pekalongan City', 'Tegal City', 'Banyumas Regency (Purwokerto)', 'Kudus Regency', 'Klaten Regency', 'Sukoharjo Regency', 'Cilacap Regency'],
      'Bali (Denpasar)': ['Denpasar City', 'Badung Regency (Kuta/Seminyak/Canggu/Nusa Dua)', 'Gianyar Regency (Ubud)', 'Tabanan Regency', 'Buleleng Regency (Singaraja)', 'Karangasem Regency', 'Klungkung Regency', 'Bangli Regency', 'Jembrana Regency'],
    },
  },

  'Malaysia': {
    states: [
      'Federal Territory of Kuala Lumpur', 'Selangor', 'Penang (Pulau Pinang)', 'Johor',
      'Perak (Ipoh)', 'Sabah (Kota Kinabalu)', 'Sarawak (Kuching)', 'Kedah (Alor Setar)',
      'Melaka (Malacca)', 'Pahang (Kuantan)', 'Negeri Sembilan (Seremban)', 'Terengganu (Kuala Terengganu)',
      'Kelantan (Kota Bharu)', 'Perlis (Kangar)', 'Federal Territory of Putrajaya', 'Federal Territory of Labuan'
    ],
    districts: {
      'Federal Territory of Kuala Lumpur': ['Bukit Bintang / City Centre', 'Bangsar / Mid Valley', 'Mont Kiara / Sri Hartamas', 'Cheras', 'Kepong', 'Setapak / Wangsa Maju', 'Seputeh / Old Klang Road', 'Segambut', 'Titiwangsa', 'Lembah Pantai', 'Bandar Tun Razak', 'Batu'],
      'Selangor': ['Petaling (Petaling Jaya/Shah Alam/Subang Jaya)', 'Hulu Langat (Kajang/Ampang/Bangi)', 'Klang', 'Gombak (Selayang/Rawang)', 'Sepang (Cyberjaya/KLIA)', 'Kuala Langat (Banting)', 'Kuala Selangor', 'Hulu Selangor', 'Sabak Bernam'],
      'Penang (Pulau Pinang)': ['Northeast Penang Island (George Town/Tanjung Bungah)', 'Southwest Penang Island (Bayan Lepas/Batu Maung)', 'Central Seberang Perai (Bukit Mertajam)', 'North Seberang Perai (Butterworth)', 'South Seberang Perai (Nibong Tebal)'],
      'Johor': ['Johor Bahru (City/Iskandar Puteri/Tebrau)', 'Kulai', 'Pasir Gudang', 'Batu Pahat', 'Muar', 'Kluang', 'Kota Tinggi', 'Segamat', 'Pontian', 'Tangkak', 'Mersing'],
      'Sarawak (Kuching)': ['Kuching', 'Miri', 'Sibu', 'Bintulu', 'Samarahan', 'Sri Aman', 'Sarikei', 'Limbang', 'Kapit', 'Mukah', 'Betong', 'Serian'],
    },
  },

  'Singapore': {
    states: [
      'Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'
    ],
    districts: {
      'Central Region': ['Downtown Core (Raffles Place/Marina Bay)', 'Orchard / Somerset', 'Bukit Merah / HarbourFront', 'Tiong Bahru / Queenstown', 'Novena / Newton', 'Bishan / Toa Payoh', 'Geylang / Kallang', 'Tanglin / River Valley', 'Southern Islands / Sentosa'],
      'East Region': ['Bedok / Marine Parade', 'Tampines', 'Pasir Ris', 'Changi / Changi Bay'],
      'North Region': ['Woodlands', 'Yishun', 'Sembawang', 'Lim Chu Kang / Sungei Kadut'],
      'North-East Region': ['Ang Mo Kio', 'Hougang', 'Punggol', 'Sengkang', 'Serangoon'],
      'West Region': ['Jurong East / Jurong West', 'Clementi', 'Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Tuas / Pioneer', 'Boon Lay'],
    },
  },

  'New Zealand': {
    states: [
      'Auckland', 'Canterbury (Christchurch)', 'Wellington', 'Waikato (Hamilton)',
      'Bay of Plenty (Tauranga/Rotorua)', 'Otago (Dunedin/Queenstown)', 'Manawatū-Whanganui (Palmerston North)',
      'Hawke\'s Bay (Napier/Hastings)', 'Taranaki (New Plymouth)', 'Northland (Whangārei)',
      'Southland (Invercargill)', 'Nelson / Tasman', 'Marlborough (Blenheim)', 'Gisborne', 'West Coast (Greymouth)'
    ],
    districts: {
      Auckland: ['Auckland Central / CBD', 'North Shore (Takapuna/Albany)', 'Waitākere (Henderson/Westgate)', 'Manukau (Manukau City/Howick)', 'Franklin (Pukekohe)', 'Rodney (Warkworth/Orewa)', 'Waiheke Island'],
      'Canterbury (Christchurch)': ['Christchurch City (Central/Riccarton/Papanui)', 'Selwyn District (Rolleston/Lincoln)', 'Waimakariri District (Rangiora)', 'Timaru District', 'Ashburton District', 'Hurunui District', 'Waimate District', 'Mackenzie District'],
      'Wellington': ['Wellington City (Te Aro/Thorndon/Karori/Miramar)', 'Hutt City (Lower Hutt)', 'Upper Hutt City', 'Porirua City', 'Kāpiti Coast District', 'Masterton District', 'South Wairarapa District', 'Carterton District'],
      'Waikato (Hamilton)': ['Hamilton City', 'Waipā District (Cambridge/Te Awamutu)', 'Waikato District', 'Matamata-Piako District', 'Thames-Coromandel District', 'Taupō District', 'South Waikato District', 'Otorohanga District', 'Waitomo District'],
      'Otago (Dunedin/Queenstown)': ['Dunedin City', 'Queenstown-Lakes District (Queenstown/Wanaka)', 'Central Otago District (Alexandra/Cromwell)', 'Clutha District (Balclutha)', 'Waitaki District (Oamaru)'],
    },
  },

  'Ireland': {
    states: [
      'Leinster (Dublin)', 'Munster (Cork/Limerick)', 'Connacht (Galway)', 'Ulster (Donegal/Monaghan/Cavan)'
    ],
    districts: {
      'Leinster (Dublin)': ['Dublin City (Dublin 1 to 24)', 'Dún Laoghaire–Rathdown', 'Fingal (Swords/Malahide/Blanchardstown)', 'South Dublin (Tallaght/Clondalkin)', 'County Kildare (Naas/Newbridge)', 'County Meath (Navan)', 'County Wicklow (Bray/Greystones)', 'County Louth (Dundalk/Drogheda)', 'County Westmeath (Athlone/Mullingar)', 'County Kilkenny', 'County Wexford', 'County Laois', 'County Offaly', 'County Carlow', 'County Longford'],
      'Munster (Cork/Limerick)': ['Cork City', 'County Cork', 'Limerick City and County', 'County Galway', 'County Clare (Ennis)', 'County Kerry (Tralee/Killarney)', 'Waterford City and County', 'County Tipperary (Clonmel/Nenagh)'],
      'Connacht (Galway)': ['Galway City', 'County Galway', 'County Mayo (Castlebar)', 'County Sligo', 'County Roscommon', 'County Leitrim'],
      'Ulster (Donegal/Monaghan/Cavan)': ['County Donegal (Letterkenny)', 'County Cavan', 'County Monaghan'],
    },
  },

  'Switzerland': {
    states: [
      'Zurich (Zürich)', 'Bern (Berne)', 'Vaud (Lausanne)', 'Geneva (Genève)',
      'Aargau', 'St. Gallen', 'Lucerne (Luzern)', 'Ticino (Lugano/Bellinzona)',
      'Valais (Wallis/Sion)', 'Basel-Stadt (Basel)', 'Fribourg (Freiburg)', 'Solothurn',
      'Basel-Landschaft (Liestal)', 'Thurgau (Frauenfeld)', 'Graubünden (Chur)', 'Neuchâtel',
      'Schwyz', 'Zug', 'Schaffhausen', 'Jura (Delémont)', 'Appenzell Ausserrhoden',
      'Nidwalden', 'Glarus', 'Obwalden', 'Uri', 'Appenzell Innerrhoden'
    ],
    districts: {
      'Zurich (Zürich)': ['District of Zürich (City of Zürich)', 'Winterthur District', 'Uster District', 'Bülach District', 'Dietikon District', 'Horgen District', 'Meilen District', 'Affoltern District', 'Hinwil District', 'Pfäffikon District', 'Dielsdorf District', 'Andelfingen District'],
      'Geneva (Genève)': ['City of Geneva (Genève)', 'Vernier', 'Lancy', 'Meyrin', 'Carouge', 'Onex', 'Thônex', 'Versoix', 'Le Grand-Saconnex', 'Chêne-Bougeries'],
      'Vaud (Lausanne)': ['Lausanne District', 'Lavaux-Oron', 'Morges District', 'Nyon District', 'Ouest Lausannois', 'Riviera-Pays-d\'Enhaut (Montreux/Vevey)', 'Broye-Vully', 'Gros-de-Vaud', 'Jura-Nord vaudois (Yverdon-les-Bains)', 'Aigle District'],
      'Basel-Stadt (Basel)': ['Basel City', 'Riehen', 'Bettingen'],
      'Bern (Berne)': ['Bern-Mittelland (City of Bern/Köniz/Ostermundigen)', 'Biel/Bienne', 'Thun', 'Emmental', 'Oberaargau', 'Interlaken-Oberhasli', 'Seeland', 'Obersimmental-Saanen', 'Frutigen-Niedersimmental', 'Jura bernois'],
    },
  },
};

/**
 * Universal safe helper to get available administrative states/provinces/regions for ANY country.
 * If none are explicitly mapped, returns an empty array to allow immediate, frictionless freeform input.
 */
export function getStatesForCountry(countryName: string): string[] {
  if (!countryName) return [];
  const normalized = countryName.trim();
  const directMatch = COUNTRY_LOCATIONS[normalized];
  if (directMatch) return directMatch.states;

  // Case-insensitive fallback
  const lower = normalized.toLowerCase();
  const foundKey = Object.keys(COUNTRY_LOCATIONS).find(
    (k) => k.toLowerCase() === lower
  );
  if (foundKey) {
    return COUNTRY_LOCATIONS[foundKey].states;
  }

  return [];
}

/**
 * Universal safe helper to get available districts/counties/municipalities for a country & state.
 */
export function getDistrictsForState(countryName: string, stateName: string): string[] {
  if (!countryName || !stateName) return [];
  const normalizedCountry = countryName.trim();
  const normalizedState = stateName.trim();

  let countryData = COUNTRY_LOCATIONS[normalizedCountry];
  if (!countryData) {
    const lowerCountry = normalizedCountry.toLowerCase();
    const foundKey = Object.keys(COUNTRY_LOCATIONS).find(
      (k) => k.toLowerCase() === lowerCountry
    );
    if (foundKey) countryData = COUNTRY_LOCATIONS[foundKey];
  }

  if (!countryData || !countryData.districts) return [];

  // Direct state match
  if (countryData.districts[normalizedState]) {
    return countryData.districts[normalizedState];
  }

  // Case-insensitive state search or partial match
  const lowerState = normalizedState.toLowerCase();
  const foundStateKey = Object.keys(countryData.districts).find(
    (sk) => sk.toLowerCase() === lowerState || sk.toLowerCase().startsWith(lowerState) || lowerState.startsWith(sk.toLowerCase())
  );

  if (foundStateKey && countryData.districts[foundStateKey]) {
    return countryData.districts[foundStateKey];
  }

  return [];
}

export { COUNTRIES, getDialCodeForCountry };
export type { CountryOption };
