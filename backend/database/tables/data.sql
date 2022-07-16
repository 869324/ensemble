INSERT INTO ensemble.dbo.roles (name) VALUES
	 (N'Admin'),
	 (N'Project Manager'),
	 (N'Team Member');


INSERT INTO ensemble.dbo.teams (teamId,name) VALUES
	 (N'f67a61a3-370a-4727-9c6f-92bc3fbeaa3a',N'ACL'),
	 (N'ff28b8fd-e568-4bc4-b803-796fed9b1170',N'Legendssss');


INSERT INTO ensemble.dbo.projects (projectId,name,team,budget,progress) VALUES
	 (N'04cb7a7e-d1f1-4c27-86ab-c5aca4f660d7',N'Chally',N'f67a61a3-370a-4727-9c6f-92bc3fbeaa3a',100.0,0.0),
	 (N'1d277069-a873-4d28-a527-eace8e286bd1',N'ACL',N'f67a61a3-370a-4727-9c6f-92bc3fbeaa3a',150.0,0.0);


INSERT INTO ensemble.dbo.tables (tableId,name,description,project) VALUES
	 (N'0681a1a7-63e4-4140-af59-420cc0bb0f68',N'AssessmentBot',N'assessments ids, name and desc',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'0d3d8734-aee8-46bd-b1d4-dfa20a2f9eb9',N'sdfvfg',N'Zxcvb',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'230049d4-7386-4df6-b736-3925b2b4a279',N'atbd',N'',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'518f1061-399e-4fbd-98b4-d7addcb434e0',N'some _table',N'dfcgvbh',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'b2d0b37c-f4e1-4806-9869-21d66c7f3262',N'table 2',N'',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'e7bb2aec-a354-4353-9aa2-54007cc5ffdb',N'Cypress Tests',N'jay ho weeeh',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'f5f7bfe3-3d00-4a81-9449-cc35681826c4',N'Cypress Testsss',N'jay ho weee',N'1d277069-a873-4d28-a527-eace8e286bd1');


INSERT INTO ensemble.dbo.users (userId,email,firstname,lastname,userType,password,isDeleted,configuredPassword) VALUES
	 (N'7fbbfca0-7aff-4f79-bf31-5fc56aa750ae',N'javankyalo2@gmail.com',N'Javan',N'Kyalo',1,N'$2a$10$173S84jNPqHolwfWg7GX1.XDs/DK31woEK9h4NVovnKo/Zz7Dqk9q',0,1),
	 (N'b1675a63-3ece-4e08-8224-0956e958bca3',N'javan.kyalo@thejitu.com',N'Javan',N'Kyaloooo',2,N'$2a$10$hcOK6pLkUbhnt7VC2wqPGOmbG39nUjirRqmh.JxZTb.4JsQzpi2/O',0,0);


INSERT INTO ensemble.dbo.classes (classId,name,description,parent,project) VALUES
	 (N'03061c55-c3c3-40b8-9b06-65992cd1248e',N'modified',N'should be modifed',N'05cf6a24-8e73-4611-8214-dc6a2bd0d6f2',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'05cf6a24-8e73-4611-8214-dc6a2bd0d6f2',N'Project',N'typical project; owned by team',NULL,N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'af7db95a-172f-4257-bf52-a70db1b88408',N'User',N'typical user',NULL,N'1d277069-a873-4d28-a527-eace8e286bd1');


INSERT INTO ensemble.dbo.columns (columnId,name,description,datatype,owner) VALUES
	 (N'0fe6b4c2-9638-4063-984b-69d3f7a49dbb',N'col3',N'column3',N'datetime',N'0d3d8734-aee8-46bd-b1d4-dfa20a2f9eb9'),
	 (N'2f63dba3-f02e-491a-9d1b-dbc1942ca5f3',N'assessmentbot',N'ggg',N'ggg',N'518f1061-399e-4fbd-98b4-d7addcb434e0'),
	 (N'425a9f9d-766e-4c2d-87c5-5828e63787d6',N'col2',N'column2',N'varchar',N'0d3d8734-aee8-46bd-b1d4-dfa20a2f9eb9'),
	 (N'64c99345-366a-41e8-8dce-a1875523756e',N'col1',N'foreign key',N'int',N'f5f7bfe3-3d00-4a81-9449-cc35681826c4'),
	 (N'8ec310cc-0f22-4981-817d-4154de0b16d7',N'AssessmentBot',N'primary key',N'varchar',N'0681a1a7-63e4-4140-af59-420cc0bb0f68'),
	 (N'a8e6e764-8a82-4ffb-b451-52758297037e',N'AssessmentBot',N'primary key',N'varchar',N'518f1061-399e-4fbd-98b4-d7addcb434e0');


INSERT INTO ensemble.dbo.endpoints (endpointId,name,description,project,url) VALUES
	 (N'5fc9697e-b7c1-4c0b-980c-32a55b483c84',N'AssessmentBot',N'AssessmentBot',N'1d277069-a873-4d28-a527-eace8e286bd1',N'https://javan_kyalo'),
	 (N'b5587458-4eca-44c7-adfb-174ecf32938c',N'get users',N'get users',N'1d277069-a873-4d28-a527-eace8e286bd1',N'/users/getAllUsers');


INSERT INTO ensemble.dbo.tableRelationships (relationshipId,column1,column2,owner) VALUES
	 (N'5c992343-138c-488b-9ad3-e6a2e5f481ac',N'64c99345-366a-41e8-8dce-a1875523756e',N'0fe6b4c2-9638-4063-984b-69d3f7a49dbb',N'f5f7bfe3-3d00-4a81-9449-cc35681826c4_0d3d8734-aee8-46bd-b1d4-dfa20a2f9eb9'),
	 (N'b547a7a7-f536-44bb-b7f5-a33fa03089af',N'8ec310cc-0f22-4981-817d-4154de0b16d7',N'64c99345-366a-41e8-8dce-a1875523756e',N'0681a1a7-63e4-4140-af59-420cc0bb0f68_f5f7bfe3-3d00-4a81-9449-cc35681826c4');



INSERT INTO ensemble.dbo.notes (noteId,name,[text],parent,project) VALUES
	 (N'42715488-42a7-4b8e-9889-a9780586affb',N'Intro',N'This project is all about bugs and depression. Enjoy!!
',NULL,N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'5f41671e-74f6-4ad8-9f0e-8c986fb244a5',N'giberish',N'asxhdcjvkbln;m,''.?.,mnbvcxzvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',N'bad8bd98-cba3-4d78-8b9e-60b9aa9d9d2b',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'6aa17587-78a7-42eb-8beb-31e4a7aed35c',N'sub intro 1',N'min introduction one',N'42715488-42a7-4b8e-9889-a9780586affb',N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'9cab870a-c6c5-4eba-8a89-5a6c6370138d',N'topic 2',N'',NULL,N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'bad8bd98-cba3-4d78-8b9e-60b9aa9d9d2b',N'topic 1',N'',NULL,N'1d277069-a873-4d28-a527-eace8e286bd1'),
	 (N'e3966aad-c0c6-4c0d-931f-f7ef6bbee024',N'sub intro',N'Mini introduction to this madness',N'42715488-42a7-4b8e-9889-a9780586affb',N'1d277069-a873-4d28-a527-eace8e286bd1');



INSERT INTO ensemble.dbo.teamMembers (membershipId,team,[member]) VALUES
	 (N'7fbbfca0-7aff-4f79-bf31-5fc56aa750ae_f67a61a3-370a-4727-9c6f-92bc3fbeaa3a',N'f67a61a3-370a-4727-9c6f-92bc3fbeaa3a',N'7fbbfca0-7aff-4f79-bf31-5fc56aa750ae');


INSERT INTO ensemble.dbo.[attributes] (attributeId,name,datatype,owner) VALUES
	 (N'ad695b1f-13b1-4872-b717-39a98808d384',N'projectId',N'int',N'05cf6a24-8e73-4611-8214-dc6a2bd0d6f2'),
	 (N'b97fcf1c-c80d-43fc-be34-7d4b16a46773',N'name',N'string',N'03061c55-c3c3-40b8-9b06-65992cd1248e');


