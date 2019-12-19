CREATE DATABASE IF NOT EXISTS SigningSystem CHARACTER SET utf8;

USE SigningSystem;

DROP TABLE IF EXISTS MemberInfo;
DROP TABLE IF EXISTS Member;
DROP TABLE IF EXISTS SigningEvent;

CREATE Table Member(
    mID          		INT    KEY AUTO_INCREMENT,
    mName        		VARCHAR(20) NOT NULL,
    mAccount            VARCHAR(20) NOT NULL UNIQUE,
    mPassword           VARCHAR(32) NOT NULL,
    mClassID            INT    		NOT NULL,
	mJobNumber			VARCHAR(40) NOT NULL UNIQUE,
	mSex				VARCHAR(2)	NOT NULL,
    mRegDate            DATE   		NOT NULL,
    isAdmin             INT    		DEFAULT 0,
    isSuAdmin           INT    		DEFAULT 0
)ENGINE=InnoDB;

CREATE TABLE SigningEvent(
	seID      INT    KEY AUTO_INCREMENT,
    seName    VARCHAR(40) NOT NULL,
    seClassID INT,
    sePublicDate Date,
    seValidDate  Date
)ENGINE=InnoDB;

CREATE TABLE MemberInfo(
		mID		INT NOT NULL,
		seID    INT NOT NULL,
		PRIMARY KEY(mID,seID),
		FOREIGN KEY(mID)		REFERENCES Member(mID)		ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY(seID)		REFERENCES SigningEvent(seID)		ON DELETE CASCADE ON UPDATE CASCADE,
		miStatus	INT		DEFAULT 0
)ENGINE=InnoDB;
