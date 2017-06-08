# Rose-Hulman-XPRIZE-Competition

GitHub Instructions

New Feature: 
USE TRELLO PLEASE!
	When you are about to work on your own feature, cd to the project repo on your laptop and type in git branch. Make sure you are on master branch. Also check if you have the most up to date repo by typing git status or git pull. Then type in git checkout -b 'branch-mame'. Please use the naming convention feature-initial such as randomisation-yd.
Commit New Feature: 
Once you are done with development on your own branch. Follow the commands below to push your changes to your own branch.
	git add *
	git commit -m "type in message"
	git push origin 'branch-name'
Create a merge request and assign a teammate to review the code.
Merge and Sqaush New Feature:
	Once the teammate approve the code, the teammate needs to follow the commands below to merge the MR to master. 
	DO NOT MERGE YOUR OWN BRANCH UNLESS DISCUSSED WITH REVIEWER!
	use git fetch on local repo on your terminal to find the remote branches
	git checkout 'branch-name' to pull down the remote branch
	git checkout master 
	git merge --squash 'branch-name' to merge the new branch to master branch
	git commit -m "merged branch-name" 
	git push to push
	
The teammate who has merged the request should move the feature Trello card to done. 
