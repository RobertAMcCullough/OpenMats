USE openmats;

CREATE TABLE Users( -- one-to-many relationship with 'openmats', 'Gyms', and 'comments'
    Id INT PRIMARY KEY NOT NULL IDENTITY(1, 1),
    GoogleId VARCHAR(50),  -- only used if google oauth is used to create account
    FacebookId VARCHAR(50),  -- only used if faceboaok oauth is used to create account
    TwitterId VARCHAR(50),  -- only used if twitter oauth is used to create account
    UserName VARCHAR(100),
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    -- password VARCHAR(100), -- hashed password
    PasswordHash NVARCHAR(256),
    -- PasswordSalt NVARCHAR(256),
    Photo VARCHAR(600),  -- url to Photo
    Email VARCHAR(200),
    Location VARCHAR(200),  -- text string that user enters
    CreatedAt DATE DEFAULT GETDATE() 
);

CREATE TABLE Gyms( -- an indivIdual gym, one-to-many relationship with openmats. many-to-one relationship with Users
    Id INT PRIMARY KEY NOT NULL IDENTITY(1, 1),
    Name VARCHAR(100) NOT NULL,
    Street VARCHAR(200),
    City VARCHAR(200) NOT NULL,
    State VARCHAR(2) NOT NULL, -- also applies to province, etc. for outsIde of USA
    Lat DECIMAL(20,17),
    Lng DECIMAL(20,17),
    Phone VARCHAR(15),
    Website VARCHAR(200),
    Photo VARCHAR(800), -- Photo url
    CreatedAt DATE DEFAULT GETDATE(),
    -- FOREIGN KEYS
    GymCreatedBy INT DEFAULT 1,
    FOREIGN KEY (GymCreatedBy) REFERENCES Users(Id)
);

CREATE TABLE Openmats( -- indivIdual open mat, many-to-on relationship with 'Gyms' table, one-to-many relationship with 'comments' table, many-to-one relationship with 'Users' table
    Id INT PRIMARY KEY NOT NULL IDENTITY(1, 1),
    Day VARCHAR(10) NOT NULL, -- day of week (e.g. 'Monday')
    Time TIME NOT NULL,
    Cost INT,
    CallFirst INT, -- 0 = 'no, no need to call ahead' 1 = 'yes, call first'
    Size VARCHAR(2), -- can be 'S' (0-10), 'M' (10-20), 'L' (20-30), 'XL' (30+)
    GiNogi INT, -- 1 = gi, 2 = nogi, 3 = mixed, 4 = alternates
    Notes VARCHAR(2000), -- description, things to know, etc
    CreatedAt DATE DEFAULT GETDATE(),
    UpdatedAt DATE DEFAULT GETDATE(),
    -- FOREIGN KEYS
    GymId INT, -- references gym location
    CreatedBy INT DEFAULT 1, -- 1 applies to admin
    UpdatedBy INT DEFAULT 1, -- 1 applies to admin
    FOREIGN KEY (GymId) REFERENCES Gyms(Id) ON DELETE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    FOREIGN KEY (UpdatedBy) REFERENCES Users(Id)
);


-- INSERT INTO Users (Username, FirstName, PasswordHash, PasswordSalt) VALUES('admin', 'bob', 'asfd2f2faw', '$2a$10$ETx/6FcWqgazFV3wG3uSS.eGa2G4QJRXlynfGGs7BNqQzeocNuffe');

INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Dark Clan Fight Lab','1106 Smith Rd #106','Austin','TX','(512) 514-0995','https://darkclanfightlab.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/1.JPG',30.2554164,-97.6811797);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Cooper MMA','13776 US-183 #122','Austin','TX','(512) 335-0800','http://www.coopermma.com/schedule','https://openmats.s3.amazonaws.com/gymPhotos/2.JPG',30.4623309,97.7964293);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('John''s Gym','11416 Ranch Rd 620 N','Austin','TX','(512) 621-8136','https://www.johnsgymatx.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/3.JPG',30.45361,-97.8288214);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Strong Base Jiujitsu','663 Palomar St STE C','Chula Vista','CA','(619) 874-0027','http://sbbjj.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/4.JPG',32.60375,-117.08284);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Carlson Gracie EscondIdo','1980 E Valley Pkwy','EscondIdo','CA','(760) 500-7710','https://www.carlsongracieescondIdo.com/untitled-citr','https://openmats.s3.amazonaws.com/gymPhotos/5.JPG',33.13759,-117.05245);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('10th Planet Spring Valley','2705 Via Orange Way','Spring Valley','CA','(619) 303-9595','https://10thplanetspringvalley.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/6.JPG',32.73041,-116.96651);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('10th Planet OceansIde','1006 Mission Ave','OceansIde','CA','(760) 587-5769','https://10thplanetoceansIde.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/7.JPG',33.19978,-117.37539);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Chula Vista Jiu Jitsu Club','315 1/2 3rd Ave','Chula Vista','CA','(619) 934-5995','http://chulavistajiujitsuclub.com/','https://openmats.s3.amazonaws.com/gymPhotos/8.JPG',32.64077,-117.0793);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Alliance Jiu Jitsu San Diego','8990 Miramar Rd #225','San Diego','CA','(858) 549-1226','https://www.alliancesandiego.com/schedule','https://openmats.s3.amazonaws.com/gymPhotos/9.JPG',32.8949,-117.13223);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Alliance Jiu Jitsu Carlsbad','2804 Roosevelt St Suite B','Carlsbad','CA','(760) 917-2664','https://www.alliancecarlsbad.com/class/open-mat/','https://openmats.s3.amazonaws.com/gymPhotos/10.JPG',33.16246,-117.34948);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Honu Jiu Jitsu Imperial Beach','641 9th St','Imperial Beach','CA','(619) 365-4668','https://www.honubjj.com/schedule-for-imperial-beach','https://openmats.s3.amazonaws.com/gymPhotos/11.JPG',32.58451,-117.11426);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Honu Jiu Jitsu El Cajon','926 Broadway','El Cajon','CA','(619) 365-4668','https://www.honubjj.com/schedule-for-el-cajon','https://openmats.s3.amazonaws.com/gymPhotos/12.JPG',32.80779,-116.94995);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Barum Jiu-Jitsu San Diego','4903 Morena Blvd #1202','San Diego','CA','(858) 361-6989','http://www.barumjiujitsu.com/class-schedule/','https://openmats.s3.amazonaws.com/gymPhotos/13.JPG',32.8313,-117.22897);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Fitness Fight Factory','6801 Rufe Snow Dr STE 300 F3','Watauga','TX','(817) 656-5600','https://fitnessfightfactory.com/Home/Schedule','https://openmats.s3.amazonaws.com/gymPhotos/14.JPG',32.87322,-97.23849);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Genesis Jiu Jitsu Burleson','251 SW Wilshire Blvd #123','Burleson','TX','(682) 472-9124','http://www.burlesonjiujitsu.com/','https://openmats.s3.amazonaws.com/gymPhotos/15.JPG',32.5426,-97.32962);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Apex Grappling Academy','2922 State Hwy 205','Rockwall','TX','(910) 723-2330','https://www.facebook.com/apexgrapplingacademy/','https://openmats.s3.amazonaws.com/gymPhotos/16.JPG',32.861408,-96.405167);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('VA Academy Jiu Jitsu','711 Business Way','Wylie','TX','(214) 501-4437','https://www.vabjj.com/schedule','https://openmats.s3.amazonaws.com/gymPhotos/17.JPG',33.00936,-96.55351);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Top Game Jiu Jitsu Studio','1402 N Corinth St #209','Corinth','TX','(940) 600-4806','https://topgamejj.com/classes/','https://openmats.s3.amazonaws.com/gymPhotos/18.JPG',33.15822,-97.06156);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Double Five Jiu Jitsu HV','1800 Justin Rd #1800A','Highland Village','TX','(203) 628-8096','https://doublefivejiujitsuhv.com/Home/Schedule','https://openmats.s3.amazonaws.com/gymPhotos/19.JPG',33.07206,-97.04514);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Fort Worth Judo Club','5302 Trail Lake Dr','Fort Worth','TX','(817) 207-9500','https://www.fortworthjudo.org/','https://openmats.s3.amazonaws.com/gymPhotos/20.JPG',32.66938,-97.38369);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Street Jitsu Roanoke','4000 Haslet-Roanoke Rd #24','Roanoke','TX','(817) 808-0250','https://www.Streetjitsu.com/roanoke-schedule','https://openmats.s3.amazonaws.com/gymPhotos/21.JPG',32.97731,-97.27474);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Easton TC - Centennial','5170 E Arapahoe Rd Suite E2','Centennial','CO','(720) 998-5795','https://eastonbjj.com/centennial/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/22.JPG',39.59496,-104.92743);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Easton TC - Boulder','2005 32nd St, Boulder','Boulder','CO','(303) 938-1275','https://eastonbjj.com/boulder/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/23.JPG',40.02108,-105.25199);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Warrior Fitness Center','3711 Drennan Road','Colorado Springs','CO','(719) 465-2136','https://www.martialartscoloradospringsco.com/','https://openmats.s3.amazonaws.com/gymPhotos/24.JPG',38.78168,-104.75838);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Renzo Gracie Jiu-Jitsu Clarksville','327 Warfield Blvd','Clarksville','TN','(931) 241-2159','https://www.renzogracieclarksville.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/25.JPG',36.57221,-87.29204);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Orlando Brazilian Jiu-Jitsu','28 W Michigan St','Orlando','FL','(407) 694-9727','https://www.orlandobjj.com/schedule','https://openmats.s3.amazonaws.com/gymPhotos/26.JPG',28.5122,-81.37751);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Rising Sun Brazilian Jiu Jitsu Academy','195 Main St','RIdgefield Park','NJ','(201) 440-4466','https://risingsunacademy.net/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/27.JPG',40.85675,-74.02486);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Relson Gracie Jiu Jitsu South Austin','8213 Brodie Ln Suite 107','Austin','TX','(512) 280-0899','https://www.relsongraciesouthaustin.com/class-schedule.html','https://openmats.s3.amazonaws.com/gymPhotos/28.JPG',30.20091,-97.83836);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Alliance Bonita','4248 Bonita Rd','Bonita','CA','(619) 259-2062','http://www.alliancebjjbonita.com/?fbclId=IwAR2dZjT3WMufnC4N42L367Y4Bb-Ze723vsH7UWZBSqTDYNzWeSJU3PG_ErA','https://openmats.s3.amazonaws.com/gymPhotos/29.JPG',32.66068,-117.0356);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Mat Chess MMA','5508 35th Ave NE','Seattle','WA','(425) 457-4947','http://matchessmma.com/Home/Schedule','https://openmats.s3.amazonaws.com/gymPhotos/30.JPG',47.66887,-122.28986);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('EastsIde Grappling','210 SE Madison St','Portland','OR','(971) 237-6626','http://www.eastsIdegrappling.com/open-mat','https://openmats.s3.amazonaws.com/gymPhotos/31.JPG',45.51261,-122.66352);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Mata Leao Combat Sports','1115 SE Stephens St','Portland','OR','(503) 208-3160','http://www.mataleaocs.com/open-mat-jiu-jitsu-portland-top-5-reasons-open-mat-rocks/','https://openmats.s3.amazonaws.com/gymPhotos/32.JPG',45.50941,-122.65434);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('One World Jiu Jitsu','37300 Cedar Blvd a','Newark','CA','(510) 279-8239','http://oneworldjiujitsu.com/about/','https://openmats.s3.amazonaws.com/gymPhotos/33.JPG',37.54032,-122.02116);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Ralph Gracie Berkeley Jiu Jitsu Academy','1500 Ashby Ave','Berkeley','CA','(510) 486-8000','http://ralphgracieberkeley.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/34.JPG',37.85312,-122.2787);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Profectus Brazilian Jiu Jitsu','91 Seaboard Ln # 106','Brentwood','TN','(615) 915-1330','https://profectushq.com/schedule','https://openmats.s3.amazonaws.com/gymPhotos/35.JPG',35.96582,-86.8163);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Schell Shock BJJ','6109 NC-55 #133','Fuquay-Varina','NC','(919) 518-5204','https://fuquay-varina-martial-arts.com/schedule/','https://openmats.s3.amazonaws.com/gymPhotos/36.JPG',35.59278,-78.75657);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('JM Modern Jiu Jitsu','14141 Airline Hwy Bldg 4 Ste Y','Baton Rouge','LA','(225) 316-1129','https://www.jmmodernjj.com/faqschedule','https://openmats.s3.amazonaws.com/gymPhotos/37.JPG',30.36729,-91.02493);
INSERT INTO Gyms(Name,Street,City,State,Phone,Website,Photo,Lat,Lng) VALUES ('Sakura Warrior Arts','255 SW Higgins Ave','Missoula','MT','(406) 728-8187','https://www.surawarriorarts.com/schedule','https://openmats.s3.amazonaws.com/gymPhotos/38.JPG',46.84007,-113.99993);


INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (1,'Friday','12:00:00',0,0,'L',4,'7-Minute Friday');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (1,'Friday','18:00:00',0,0,'L',4,'2 hours but most people are there the first hour.');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (2,'Sunday','15:00:00',0,0,'L',2,'Very tough room but friendly.');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (3,'Thursday','12:00:00',0,0,'S',1,'Very welcoming, sometimes starts a few minutes late');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (3,'Friday','12:00:00',0,0,'S',2,'Very welcoming');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (4,'Saturday','10:00:00',NULL,NULL,NULL,NULL,'2 hours (10 to noon)');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (5,'Wednesday','19:00:00',NULL,1,NULL,NULL,'90 minutes');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (5,'Friday','19:00:00',NULL,1,NULL,NULL,'90 minutes');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (5,'Saturday','9:00:00',NULL,NULL,NULL,NULL,NULL);
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (5,'Sunday','9:30:00',NULL,NULL,NULL,2,'Wrestling!');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (6,'Sunday','22:00:00',NULL,1,NULL,2,'Call first to confirm');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (7,'Sunday','13:00:00',NULL,NULL,NULL,2,'2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (8,'Saturday','7:30:00',NULL,NULL,NULL,NULL,'2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (9,'Monday','10:00:00',NULL,NULL,NULL,NULL,'Competition class, 2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (9,'Tuesday','10:00:00',NULL,NULL,NULL,NULL,'Competition class, 2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (9,'Wednesday','10:00:00',NULL,NULL,NULL,NULL,'Competition class, 2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (9,'Friday','10:00:00',NULL,NULL,NULL,NULL,'Competition class, 2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (9,'Saturday','11:00:00',NULL,NULL,NULL,NULL,'Competition class, 2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (10,'Sunday','12:00:00',NULL,NULL,NULL,3,'90 min');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (11,'Saturday','11:00:00',NULL,NULL,NULL,NULL,'2 hours');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (12,'Friday','11:00:00',NULL,NULL,NULL,NULL,NULL);
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (13,'Saturday','11:30:00',NULL,NULL,NULL,NULL,'2 hours, call to confirm');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (13,'Sunday','10:15:00',NULL,NULL,NULL,NULL,'1 hour');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (14,'Sunday','9:00:00',0,NULL,NULL,3,'KIds welcome');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (15,'Saturday','11:00:00',NULL,NULL,NULL,NULL,NULL);
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (16,'Saturday','12:00:00',0,NULL,NULL,NULL,'2 hours - noon till 2. Tough rounds, all affiliations welcome!');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (17,'Saturday','11:00:00',NULL,NULL,NULL,NULL,'2 hours - 11 to 1');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (18,'Saturday','15:00:00',NULL,NULL,NULL,NULL,'2 hours - 3 to 5');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (19,'Saturday','10:00:00',NULL,NULL,NULL,NULL,'1 hour');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (20,'Friday','19:00:00',NULL,NULL,NULL,NULL,'All ages and abilities welcome. 7-8 pm.');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (21,'Sunday','14:30:00',0,NULL,NULL,3,'90 minutes - all levels welcome!');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (22,'Tuesday','13:00:00',0,1,NULL,2,'Competition class, currently paused do to CovId');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (22,'Tuesday','13:00:00',0,1,NULL,1,'Competition class, currently paused do to CovId');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (23,'Friday','16:00:00',0,1,NULL,1,'War at 4 - 90 minutes, very tough room. Currently closed for covId.');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (24,'Sunday','11:00:00',NULL,NULL,NULL,2,'2 hour no gi');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (25,'Sunday','12:00:00',0,NULL,NULL,NULL,'2 hours, Sunday Slaughterhouse. Other Gyms welcome.');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (26,'Friday','12:10:00',NULL,1,NULL,3,'12:10 to 1:30. Mixed gi/nogi');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (27,'Sunday','11:00:00',0,1,NULL,1,'2 hours, 11-1');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (28,'Sunday','11:30:00',NULL,NULL,NULL,NULL,'2 hours - 11:30 to 1:30. Everyone welcome');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (29,'Sunday','12:00:00',NULL,NULL,NULL,NULL,'2 hours - noon till 2. Everyone welcome. Call ahead to confirm start time');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (30,'Sunday','12:00:00',NULL,NULL,NULL,NULL,'Noon till 2:30. Call ahead to confirm during CovId');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (30,'Sunday','12:00:00',NULL,NULL,NULL,NULL,'Noon till 2:30. Call ahead to confirm during CovId');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (31,'Sunday','12:00:00',NULL,NULL,NULL,1,'Open to all, very welcoming');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (32,'Sunday','12:00:00',0,NULL,NULL,NULL,'Noon till 2:00');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (33,'Sunday','18:00:00',0,NULL,NULL,NULL,'6-8 PM');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (34,'Sunday','10:00:00',0,NULL,NULL,1,'10 am til noon. Call ahead during CovId');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (35,'Saturday','11:00:00',NULL,NULL,NULL,NULL,'2 hours, 11-1');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (36,'Saturday','9:00:00',NULL,NULL,NULL,NULL,'2 hours, 9-11');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (37,'Wednesday','11:00:00',NULL,NULL,NULL,2,NULL);
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (37,'Wednesday','7:30:00',NULL,NULL,NULL,NULL,'Competition Training');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (37,'Saturday','11:00:00',NULL,NULL,NULL,NULL,'Competition Training');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (37,'Sunday','10:00:00',NULL,NULL,NULL,NULL,'90 minutes');
INSERT INTO Openmats(GymId,Day,Time,Cost,CallFirst,Size,GiNogi,Notes) VALUES (38,'Friday','5:30:00',NULL,NULL,NULL,NULL,'2 hours - 5:30 to 7:30');
