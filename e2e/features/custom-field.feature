Feature: Custom field editing
  Scenario: Edit the custom field text
    Given User is logged into contentstack
    And User navigates to edit entry page
    And User edits the custom field
    And User saves the entry
    And Open the sidebar widget
    Then See the value same as edited entry
