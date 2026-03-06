import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Production Slate functionality
  type ProductionSlate = {
    id : Nat;
    title : Text;
    createdAt : Int;
    jsonBlob : Text;
  };

  let slates = Map.empty<Nat, ProductionSlate>();
  var nextId = 0;

  public shared ({ caller }) func createSlate(title : Text, jsonBlob : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create slates");
    };
    let id = nextId;
    nextId += 1;
    let slate = {
      id;
      title;
      createdAt = Time.now();
      jsonBlob;
    };
    slates.add(id, slate);
    id;
  };

  public query ({ caller }) func getSlates() : async [(Nat, Text, Int)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view slates");
    };
    slates.values().toArray().map(
      func(slate) {
        (slate.id, slate.title, slate.createdAt : Int);
      }
    );
  };

  public query ({ caller }) func getSlate(id : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view slates");
    };
    switch (slates.get(id)) {
      case (?slate) { slate.jsonBlob };
      case (null) { Runtime.trap("production slate not found") };
    };
  };

  public shared ({ caller }) func deleteSlate(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete slates");
    };
    if (not slates.containsKey(id)) {
      Runtime.trap("production slate not found");
    };
    slates.remove(id);
  };

  public shared ({ caller }) func updateSlate(id : Nat, title : Text, jsonBlob : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update slates");
    };
    switch (slates.get(id)) {
      case (?oldSlate) {
        let newSlate = {
          oldSlate with
          title;
          jsonBlob;
        };
        slates.add(id, newSlate);
      };
      case (null) {
        Runtime.trap("production slate not found");
      };
    };
  };
};
